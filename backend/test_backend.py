"""
Automated verification test suite for Soci-Eye Backend API
Tests all core scenarios: health, KFC, Samsung S23, Pizza, BTS, Netflix, empty queries,
sentiment math invariants (sum=100%), and dynamic schema compliance.
"""

import sys
import unittest
import asyncio
from fastapi.testclient import TestClient

from main import app
from sentiment import calculate_exact_percentages, extract_top_mentions, aggregate_key_topics

class TestSociEyeBackend(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_check(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertIn("has_youtube_key", data)
        self.assertIn("has_gemini_key", data)

    def test_empty_search_validation(self):
        response = self.client.get("/api/analyze?topic=   ")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())

    def _verify_topic_response(self, topic: str):
        response = self.client.get(f"/api/analyze?topic={topic}")
        self.assertEqual(response.status_code, 200, f"Failed for topic: {topic}")
        data = response.json()
        
        # Verify schema structure
        self.assertEqual(data.get("topic").lower(), topic.lower())
        self.assertIn("analysis", data)
        analysis = data["analysis"]
        
        pos = analysis.get("positive")
        neu = analysis.get("neutral")
        neg = analysis.get("negative")
        
        self.assertIsInstance(pos, int)
        self.assertIsInstance(neu, int)
        self.assertIsInstance(neg, int)
        
        # STRICT REQUIREMENT: Sum must equal exactly 100%
        self.assertEqual(pos + neu + neg, 100, f"Percentages do not equal 100% for topic '{topic}': {pos} + {neu} + {neg} = {pos+neu+neg}")
        
        # Posts analyzed
        posts_analyzed = analysis.get("posts_analyzed")
        self.assertGreater(posts_analyzed, 0)
        
        # Key Topics
        key_topics = analysis.get("key_topics", [])
        self.assertIsInstance(key_topics, list)
        self.assertGreaterEqual(len(key_topics), 1)
        for kt in key_topics:
            self.assertIn("name", kt)
            self.assertIn("mentions", kt)
            self.assertIn("sentiment", kt)
            self.assertIn(kt["sentiment"], ["Positive", "Neutral", "Negative"])
            
        # Top Mentions
        top_mentions = analysis.get("top_mentions", [])
        self.assertIsInstance(top_mentions, list)
        self.assertGreaterEqual(len(top_mentions), 1)
        
        # Insight
        insight = analysis.get("insight", "")
        self.assertIsInstance(insight, str)
        self.assertGreater(len(insight), 10)
        
        # Posts list
        posts = analysis.get("posts", [])
        self.assertIsInstance(posts, list)
        self.assertGreater(len(posts), 0)
        first_post = posts[0]
        self.assertIn("comment", first_post)
        self.assertIn("sentiment", first_post)
        self.assertIn("aspect", first_post)
        self.assertIn("channel", first_post)
        self.assertIn("video_title", first_post)
        print(f"[OK] Tested '{topic}': {pos}% Pos, {neu}% Neu, {neg}% Neg | {len(key_topics)} Topics | {posts_analyzed} Comments Analyzed")

    def test_topic_kfc(self):
        self._verify_topic_response("KFC")

    def test_topic_samsung_s23(self):
        self._verify_topic_response("Samsung S23")

    def test_topic_pizza(self):
        self._verify_topic_response("Pizza")

    def test_topic_bts(self):
        self._verify_topic_response("BTS")

    def test_topic_netflix(self):
        self._verify_topic_response("Netflix")

    def test_sentiment_math_rounding(self):
        # Test various odd splits
        p, u, n = calculate_exact_percentages(1, 1, 1)
        self.assertEqual(p + u + n, 100)
        
        p, u, n = calculate_exact_percentages(7, 3, 11)
        self.assertEqual(p + u + n, 100)
        
        p, u, n = calculate_exact_percentages(100, 0, 0)
        self.assertEqual(p + u + n, 100)
        self.assertEqual(p, 100)

if __name__ == "__main__":
    unittest.main()
