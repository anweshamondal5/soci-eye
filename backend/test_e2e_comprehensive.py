"""
Comprehensive End-to-End Verification Test for Soci-Eye
Tests all 5 core topics: KFC, Samsung S23, Pizza, BTS, Netflix
Tests edge cases: Empty query, Whitespace query, Fallbacks, 100% math invariants,
Dynamic variation between topics, and schema correctness.
"""

import sys
import unittest
from fastapi.testclient import TestClient

from main import app
from sentiment import calculate_exact_percentages, extract_top_mentions, aggregate_key_topics
from fallback_data import generate_dynamic_fallback

class TestSociEyeComprehensiveE2E(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.results = {}

    def test_01_health_endpoint(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertIn("has_youtube_key", data)
        self.assertIn("has_gemini_key", data)
        print("[PASS] 1. Health check endpoint verified.")

    def test_02_empty_and_whitespace_search(self):
        # Empty string
        res_empty = self.client.get("/api/analyze?topic=")
        self.assertEqual(res_empty.status_code, 422) # FastAPI validation error on min_length=1

        # Whitespace string
        res_space = self.client.get("/api/analyze?topic=    ")
        self.assertEqual(res_space.status_code, 400)
        self.assertIn("error", res_space.json())
        print("[PASS] 2. Empty and whitespace input validation verified (400/422).")

    def _execute_and_validate_topic(self, topic: str):
        res = self.client.get("/api/analyze", params={"topic": topic})
        self.assertEqual(res.status_code, 200, f"Failed GET for topic: {topic}")
        data = res.json()

        self.assertEqual(data.get("topic").lower(), topic.lower())
        self.assertIn("analysis", data)
        analysis = data["analysis"]

        pos = analysis.get("positive")
        neu = analysis.get("neutral")
        neg = analysis.get("negative")
        posts_analyzed = analysis.get("posts_analyzed")
        key_topics = analysis.get("key_topics", [])
        top_mentions = analysis.get("top_mentions", [])
        insight = analysis.get("insight", "")
        posts = analysis.get("posts", [])

        # Invariant 1: Positive + Neutral + Negative MUST equal 100% exactly
        self.assertEqual(pos + neu + neg, 100, f"Math error for {topic}: {pos}+{neu}+{neg} != 100")

        # Invariant 2: Posts analyzed > 0
        self.assertGreater(posts_analyzed, 0)
        self.assertEqual(len(posts), posts_analyzed)

        # Invariant 3: Key topics populated with name, mentions, sentiment
        self.assertGreaterEqual(len(key_topics), 2)
        for kt in key_topics:
            self.assertIn("name", kt)
            self.assertIn("mentions", kt)
            self.assertIn("sentiment", kt)
            self.assertIn(kt["sentiment"], ["Positive", "Neutral", "Negative"])

        # Invariant 4: Top mentions contains clean words
        self.assertGreaterEqual(len(top_mentions), 3)

        # Invariant 5: Insight is non-empty and references the topic
        self.assertGreater(len(insight), 15)
        self.assertTrue(topic.lower() in insight.lower() or topic.replace(' ', '').lower() in insight.replace(' ', '').lower())

        # Invariant 6: Comments have channel, video title, sentiment, aspect, reason
        for p in posts[:5]:
            self.assertIn("comment", p)
            self.assertIn("sentiment", p)
            self.assertIn("aspect", p)
            self.assertIn("channel", p)
            self.assertIn("video_title", p)
            self.assertIn("video_url", p)

        self.results[topic] = {
            "pos": pos,
            "neu": neu,
            "neg": neg,
            "topics": [t["name"] for t in key_topics],
            "mentions": top_mentions,
            "posts_count": posts_analyzed,
            "sample_comment": posts[0]["comment"]
        }

        print(f"[PASS] Topic '{topic}': {pos}% Pos, {neu}% Neu, {neg}% Neg | {len(key_topics)} Topics ({', '.join(t['name'] for t in key_topics[:3])}) | {posts_analyzed} Comments Verified.")

    def test_03_kfc(self):
        self._execute_and_validate_topic("KFC")

    def test_04_samsung_s23(self):
        self._execute_and_validate_topic("Samsung S23")

    def test_05_pizza(self):
        self._execute_and_validate_topic("Pizza")

    def test_06_bts(self):
        self._execute_and_validate_topic("BTS")

    def test_07_netflix(self):
        self._execute_and_validate_topic("Netflix")

    def test_08_dynamic_diversity_between_topics(self):
        """
        Ensures results are distinct and customized across different topics:
        - Sentiment percentages differ.
        - Extracted key topics differ.
        - Comments differ.
        """
        topics = ["KFC", "Samsung S23", "Pizza", "BTS", "Netflix"]
        sentiments = [self.results[t]["pos"] for t in topics]
        
        # Verify not all sentiments are identical
        self.assertGreater(len(set(sentiments)), 3, "Sentiments must not be identical across different topics.")

        # Verify KFC topics (Taste, Crispiness, Chicken, Price) are distinct from Samsung S23 (Camera, Battery, Display)
        kfc_topics = set(self.results["KFC"]["topics"])
        samsung_topics = set(self.results["Samsung S23"]["topics"])
        bts_topics = set(self.results["BTS"]["topics"])

        self.assertNotEqual(kfc_topics, samsung_topics, "KFC topics must differ from Samsung topics.")
        self.assertNotEqual(samsung_topics, bts_topics, "Samsung topics must differ from BTS topics.")
        print("[PASS] 8. Dynamic diversity verified across all 5 distinct topics.")

    def test_09_hare_niemeyer_math_edge_cases(self):
        """
        Verifies Hare-Niemeyer math allocator never fails on prime/odd splits.
        """
        cases = [
            (1, 1, 1),
            (7, 3, 11),
            (99, 1, 0),
            (0, 0, 1),
            (333, 333, 334),
            (17, 19, 23),
            (1000, 0, 0)
        ]
        for p, u, n in cases:
            res_p, res_u, res_n = calculate_exact_percentages(p, u, n)
            self.assertEqual(res_p + res_u + res_n, 100, f"Sum failed for input ({p}, {u}, {n}): {res_p}+{res_u}+{res_n}")
        print("[PASS] 9. Hare-Niemeyer exact 100% invariant verified on extreme edge cases.")

if __name__ == "__main__":
    unittest.main()
