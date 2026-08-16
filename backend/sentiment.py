"""
Sentiment Aggregation & Top Mentions Processing
Ensures 100% exact mathematical sum, non-filler keyword extraction, and dynamic aspect clustering.
"""

import re
import math
from collections import Counter
from typing import List, Dict, Any, Tuple

# Comprehensive stopword list including social media filler, YouTube noise, and multilingual fillers
STOPWORDS = {
    # English standard
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
    "can", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
    "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
    "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
    "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into",
    "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my",
    "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our",
    "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's",
    "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs",
    "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
    "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't",
    "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's",
    "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't",
    "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself",
    "yourselves",
    # YouTube / Social media noise
    "video", "videos", "channel", "subscribe", "subscriber", "subscribers", "like", "likes", "view", "views",
    "cameraman", "bro", "brother", "guy", "guys", "first", "second", "comment", "comments", "watching",
    "watch", "editor", "editing", "link", "share", "upload", "creator", "content", "respect", "love", "great",
    "nice", "good", "bad", "also", "just", "really", "even", "much", "many", "still", "always", "never",
    "please", "sir", "mam", "bhai", "yaar", "karo", "hai", "nahi", "hain", "kya", "aur", "ye", "yeh", "woh",
    "apna", "meri", "mera", "wale", "wala", "hoga", "hone", "hoti", "kr", "kar", "dekho", "dekha"
}

def calculate_exact_percentages(pos_count: int, neu_count: int, neg_count: int) -> Tuple[int, int, int]:
    """
    Computes Positive, Neutral, and Negative percentages using Largest Remainder Method (Hare-Niemeyer),
    guaranteeing that Pos% + Neu% + Neg% == 100 exactly under all conditions.
    """
    total = pos_count + neu_count + neg_count
    if total == 0:
        return 0, 100, 0

    raw_pos = (pos_count / total) * 100
    raw_neu = (neu_count / total) * 100
    raw_neg = (neg_count / total) * 100

    floor_pos = math.floor(raw_pos)
    floor_neu = math.floor(raw_neu)
    floor_neg = math.floor(raw_neg)

    allocated = floor_pos + floor_neu + floor_neg
    remainder = 100 - allocated

    remainders = [
        ("pos", raw_pos - floor_pos),
        ("neu", raw_neu - floor_neu),
        ("neg", raw_neg - floor_neg)
    ]
    remainders.sort(key=lambda x: x[1], reverse=True)

    result = {"pos": floor_pos, "neu": floor_neu, "neg": floor_neg}
    for i in range(remainder):
        result[remainders[i][0]] += 1

    # Double check invariant
    assert result["pos"] + result["neu"] + result["neg"] == 100, "Sentiment percentages must equal 100%"
    return result["pos"], result["neu"], result["neg"]

def extract_top_mentions(comments: List[Dict[str, Any]], topic: str, top_n: int = 6) -> List[str]:
    """
    Extract meaningful and frequently discussed keywords from relevant comments,
    stripping stop words, numbers, YouTube noise, and the topic words themselves.
    """
    topic_terms = set(re.findall(r"\w+", topic.lower()))
    combined_stopwords = STOPWORDS.union(topic_terms)

    words = []
    for item in comments:
        text = item.get("comment", "") or item.get("text", "")
        # Remove URLs and handles
        clean_text = re.sub(r"http\S+|@\S+|#\S+", "", text)
        # Extract word tokens with length >= 3
        tokens = re.findall(r"\b[a-zA-Z]{3,}\b", clean_text.lower())
        for token in tokens:
            if token not in combined_stopwords and not token.isdigit():
                words.append(token)

    counter = Counter(words)
    # Return top N keywords
    most_common = [word for word, count in counter.most_common(top_n)]
    return most_common if most_common else ["experience", "quality", "service", "features", "value"]

def aggregate_key_topics(analyzed_comments: List[Dict[str, Any]], max_topics: int = 6) -> List[Dict[str, Any]]:
    """
    Clusters analyzed comments by extracted dynamic aspects and counts mentions and dominant sentiment.
    """
    topic_stats: Dict[str, Dict[str, Any]] = {}
    
    for item in analyzed_comments:
        aspect = item.get("aspect", "").strip().title()
        if not aspect or aspect.lower() in ("general", "unknown", "none", "filler", "other"):
            continue
            
        sentiment = item.get("sentiment", "Neutral")
        
        if aspect not in topic_stats:
            topic_stats[aspect] = {"mentions": 0, "pos": 0, "neu": 0, "neg": 0}
            
        topic_stats[aspect]["mentions"] += 1
        if sentiment == "Positive":
            topic_stats[aspect]["pos"] += 1
        elif sentiment == "Negative":
            topic_stats[aspect]["neg"] += 1
        else:
            topic_stats[aspect]["neu"] += 1

    sorted_aspects = sorted(topic_stats.items(), key=lambda x: x[1]["mentions"], reverse=True)[:max_topics]
    
    key_topics = []
    for aspect, stats in sorted_aspects:
        # Determine dominant sentiment for this topic
        if stats["pos"] >= stats["neu"] and stats["pos"] >= stats["neg"]:
            dominant_sentiment = "Positive"
        elif stats["neg"] >= stats["neu"] and stats["neg"] > stats["pos"]:
            dominant_sentiment = "Negative"
        else:
            dominant_sentiment = "Neutral"

        key_topics.append({
            "name": aspect,
            "mentions": stats["mentions"],
            "sentiment": dominant_sentiment
        })

    return key_topics
