import httpx
import json

topics = ['KFC', 'Samsung S23', 'Pizza', 'BTS', 'Netflix']

for t in topics:
    res = httpx.get('http://127.0.0.1:8000/api/analyze', params={'topic': t}, timeout=10.0).json()
    a = res['analysis']
    print(f"==================================================")
    print(f"TOPIC: {res['topic']}")
    print(f"SENTIMENT: {a['positive']}% Positive, {a['neutral']}% Neutral, {a['negative']}% Negative (Sum: {a['positive']+a['neutral']+a['negative']}%)")
    print(f"POSTS ANALYZED: {a['posts_analyzed']}")
    topic_list = [k['name'] + ' (' + k['sentiment'] + ')' for k in a['key_topics']]
    print("KEY TOPICS:", topic_list)
    print(f"TOP MENTIONS: {a['top_mentions']}")
    print(f"AI EXECUTIVE SYNTHESIS: {a['insight']}")
    print(f"SAMPLE CONVERSATION: \"{a['posts'][0]['comment']}\"")
    print(f"  - Aspect: {a['posts'][0]['aspect']} | Sentiment: {a['posts'][0]['sentiment']} | Reason: {a['posts'][0]['reason']}")
    print(f"  - Channel: {a['posts'][0]['channel']} | Video: {a['posts'][0]['video_title']}")
    print(f"  - Source URL: {a['posts'][0]['video_url']}")
