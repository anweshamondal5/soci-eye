"""
Soci-Eye AI Analysis Engine
Communicates with Google Gemini API for multilingual sentiment classification,
strict relevance filtering, dynamic domain aspect extraction, and grounded AI insight synthesis.
Supports both classic ('AIza...') and current Google AI Studio authentication keys ('AQ...').
"""

import json
import logging
import re
from typing import List, Dict, Any, Optional
import httpx

from config import settings
from sentiment import calculate_exact_percentages, extract_top_mentions, aggregate_key_topics
from fallback_data import generate_dynamic_fallback

logger = logging.getLogger("soci-eye.ai")

SYSTEM_INSTRUCTION = """
You are Soci-Eye's advanced social intelligence AI. Your task is to analyze public user comments regarding a specific subject or topic.

For each comment:
1. "relevant": (boolean)
   - MUST be TRUE if the comment discusses, reacts to, questions, praises, or criticizes the subject/topic (e.g. brand, product, person, food, movie, service).
   - MUST be FALSE if the comment is purely generic social noise about the YouTube video itself (e.g. "nice video", "first", "respect the cameraman", "subscribe to my channel", "who is watching in 2024").
2. "sentiment": MUST be one of "Positive", "Neutral", "Negative".
   - Multilingual comprehension: accurately evaluate English, Hindi, Hinglish, Bengali, Tamil, Telugu, Romanized Indian languages, slang, and emojis.
   - If ambiguous or a neutral question (e.g. "How much is this?", "Is this in Mumbai?"), classify as "Neutral".
3. "aspect": Extract a concise 1-2 word dynamic aspect (e.g. Taste, Price, Quality, Battery, Camera, Delivery, Shows, Subscription, Sound, Performance, Customer Service).
   - NEVER use creator names, channel names, usernames, or meaningless filler.
4. "reason": Brief 5-10 word explanation of classification.

Output valid JSON matching this exact schema:
{
  "analyzed_items": [
    {
      "index": 0,
      "relevant": true,
      "sentiment": "Positive",
      "aspect": "Taste",
      "reason": "Praises flavor and texture"
    }
  ]
}
"""

class AIAnalysisService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"]

    def _get_headers(self) -> Dict[str, str]:
        """
        Returns standard authentication headers supporting both AIza and AQ key formats.
        """
        headers = {
            "Content-Type": "application/json"
        }
        if self.api_key:
            headers["x-goog-api-key"] = self.api_key
        return headers

    async def analyze_batch_with_gemini(self, topic: str, comments_text_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Calls Google Gemini API via REST with structured JSON format to evaluate comments.
        Uses x-goog-api-key header for seamless support of Google's new AQ key format.
        """
        if not self.api_key:
            return []

        # Prepare indexed prompt payload
        comments_payload = []
        for idx, c in enumerate(comments_text_list):
            comments_payload.append({
                "index": idx,
                "text": c.get("text", "")[:300] # Limit per comment length
            })

        user_content = (
            f"Topic: \"{topic}\"\n\n"
            f"Analyze the following {len(comments_payload)} comments regarding the topic \"{topic}\":\n"
            f"{json.dumps(comments_payload, ensure_ascii=False)}"
        )

        request_body = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": user_content}]
                }
            ],
            "systemInstruction": {
                "parts": [{"text": SYSTEM_INSTRUCTION}]
            },
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }

        headers = self._get_headers()

        # Try models in order (1.5-flash -> 2.0-flash)
        for model in self.models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
            try:
                async with httpx.AsyncClient(timeout=25.0) as client:
                    response = await client.post(url, headers=headers, json=request_body)
                    
                    if response.status_code != 200:
                        logger.warning(f"Gemini API ({model}) returned {response.status_code}: {response.text[:200]}")
                        continue

                    res_json = response.json()
                    candidates = res_json.get("candidates", [])
                    if not candidates:
                        continue

                    content_parts = candidates[0].get("content", {}).get("parts", [])
                    if not content_parts:
                        continue

                    raw_text = content_parts[0].get("text", "").strip()
                    # Safely strip markdown fences if present
                    clean_json_str = raw_text
                    if clean_json_str.startswith("```"):
                        clean_json_str = re.sub(r"^```(?:json)?\s*", "", clean_json_str, flags=re.IGNORECASE)
                        clean_json_str = re.sub(r"\s*```$", "", clean_json_str)
                    try:
                        parsed = json.loads(clean_json_str)
                    except Exception:
                        match = re.search(r"(\{.*\}|\[.*\])", clean_json_str, re.DOTALL)
                        if match:
                            parsed = json.loads(match.group(1))
                        else:
                            raise
                    
                    items = parsed.get("analyzed_items", [])
                    if items:
                        return items
            except Exception as exc:
                logger.warning(f"Error calling Gemini model {model}: {exc}")
                continue

        logger.error("All Gemini models failed or returned no results.")
        return []

    async def generate_insight_with_gemini(self, topic: str, pos_pct: int, neu_pct: int, neg_pct: int, key_topics: List[Dict[str, Any]]) -> str:
        """
        Generates a concise 2-sentence summary grounded strictly in the data.
        """
        if not self.api_key:
            return ""

        prompt = (
            f"Generate a concise, 2-sentence executive social intelligence summary for topic '{topic}'.\n"
            f"Data:\n"
            f"- Positive: {pos_pct}%\n"
            f"- Neutral: {neu_pct}%\n"
            f"- Negative: {neg_pct}%\n"
            f"- Key Topics & Sentiments: {json.dumps(key_topics)}\n\n"
            f"Rules:\n"
            f"- Must be strictly grounded ONLY in the provided metrics.\n"
            f"- Explain what drives positive discussion and what drives negative discussion.\n"
            f"- Do not use filler or hypothetical claims."
        )

        request_body = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.3}
        }

        headers = self._get_headers()

        for model in self.models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    response = await client.post(url, headers=headers, json=request_body)
                    if response.status_code == 200:
                        candidates = response.json().get("candidates", [])
                        if candidates:
                            text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
                            if text:
                                return text
            except Exception as exc:
                logger.warning(f"Error generating AI insight with Gemini model {model}: {exc}")
                continue
        return ""

    async def analyze_social_intelligence(self, topic: str, raw_comments: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Complete processing pipeline for real YouTube comments + Gemini AI.
        """
        if not raw_comments:
            logger.info("No raw comments available, using dynamic fallback engine.")
            return generate_dynamic_fallback(topic)

        # Batch comments to Gemini (up to 35 comments)
        analyzed_items = []
        batch_size = 35
        for i in range(0, min(len(raw_comments), batch_size), batch_size):
            chunk = raw_comments[i:i + batch_size]
            items = await self.analyze_batch_with_gemini(topic, chunk)
            analyzed_items.extend(items)

        # If Gemini returned no results (e.g. rate limit/network drop), use dynamic intelligence
        if not analyzed_items:
            logger.info("Gemini analysis yielded no results, applying fallback engine.")
            return generate_dynamic_fallback(topic)

        # Merge analysis back into posts
        relevant_posts = []
        pos_count, neu_count, neg_count = 0, 0, 0

        for item in analyzed_items:
            idx = item.get("index", -1)
            if 0 <= idx < len(raw_comments):
                raw = raw_comments[idx]
                is_relevant = item.get("relevant", True)
                if not is_relevant:
                    continue  # Strict relevance filtering

                sentiment = item.get("sentiment", "Neutral")
                if sentiment not in ("Positive", "Neutral", "Negative"):
                    sentiment = "Neutral"

                if sentiment == "Positive":
                    pos_count += 1
                elif sentiment == "Negative":
                    neg_count += 1
                else:
                    neu_count += 1

                relevant_posts.append({
                    "id": raw.get("comment_id", f"c_{idx}"),
                    "comment": raw.get("text", ""),
                    "sentiment": sentiment,
                    "aspect": item.get("aspect", "General").title(),
                    "relevant": True,
                    "reason": item.get("reason", "Topic discussion"),
                    "channel": raw.get("channel_title", "YouTube User"),
                    "video_title": raw.get("video_title", topic),
                    "video_url": raw.get("video_url", f"https://www.youtube.com/results?search_query={topic}"),
                    "likes": raw.get("likes", 0)
                })

        if not relevant_posts:
            return generate_dynamic_fallback(topic)

        # Calculate exact 100% sentiment breakdown
        pos_pct, neu_pct, neg_pct = calculate_exact_percentages(pos_count, neu_count, neg_count)

        # Key Topics
        key_topics = aggregate_key_topics(relevant_posts, max_topics=6)

        # Top Mentions
        top_mentions = extract_top_mentions(relevant_posts, topic, top_n=6)

        # AI Insight
        insight = await self.generate_insight_with_gemini(topic, pos_pct, neu_pct, neg_pct, key_topics)
        if not insight:
            # Deterministic grounded fallback insight
            top_pos = key_topics[0]["name"] if key_topics else "Quality"
            top_neg = next((t["name"] for t in key_topics if t["sentiment"] == "Negative"), "Pricing")
            insight = (
                f"Public conversation around {topic} shows {pos_pct}% positive sentiment, "
                f"principally led by {top_pos}. Critical feedback ({neg_pct}%) primarily references {top_neg}."
            )

        return {
            "topic": topic,
            "analysis": {
                "positive": pos_pct,
                "neutral": neu_pct,
                "negative": neg_pct,
                "posts_analyzed": len(relevant_posts),
                "key_topics": key_topics,
                "top_mentions": top_mentions,
                "insight": insight,
                "posts": relevant_posts
            },
            "source": "live_youtube_gemini"
        }

ai_service = AIAnalysisService()
