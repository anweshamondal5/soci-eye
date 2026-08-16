# Soci-Eye: AI-Powered Social Intelligence 👁️✨

> **"Understand what people really think."**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Flash-8E75B2.svg?logo=google&logoColor=white)](https://aistudio.google.com)
[![YouTube Data API](https://img.shields.io/badge/YouTube%20Data-v3-FF0000.svg?logo=youtube&logoColor=white)](https://developers.google.com/youtube/v3)

**Soci-Eye** is an AI-powered full-stack social intelligence platform designed to extract, analyze, and synthesize public online discussions around any brand, product, person, or topic.

By combining the **YouTube Data API v3** for social retrieval and **Google Gemini AI** for multilingual sentiment parsing, relevance classification, and dynamic aspect clustering, Soci-Eye provides deep clarity on public opinion with exact mathematical balance.

---

## 🌟 Key Features

1. **Multilingual Sentiment Classification**:
   - Neural classification into **Positive**, **Neutral**, and **Negative**.
   - Built to understand English, Hindi, Hinglish, Bengali, Tamil, Telugu, Romanized Indian vernaculars, slang, and emojis.
   - **Strict Mathematical Invariant**: Sentiment percentages always sum to exactly 100% using the Largest Remainder Method.

2. **Strict Relevance Filtering**:
   - Filters out non-topic creator praise, videography comments (e.g. *"nice video"*, *"respect the cameraman"*, *"first comment"*), and spam, isolating comments genuine to the subject.

3. **Dynamic Aspect & Topic Extraction**:
   - Dynamically identifies subject-specific domains (e.g. for KFC: *Taste, Price, Quality, Service*; for Samsung S23: *Camera, Battery, Display, Performance*).
   - Eliminates generic filler words, creator handles, and noise.

4. **Grounded AI Insights**:
   - Synthesizes concise executive summaries directly verified by the underlying sentiment and topic distributions.

5. **Conversation Explorer**:
   - Filter and search actual analyzed comments with author channels, video titles, sentiment tags, AI classification reasoning, and direct YouTube source links.

6. **Zero-Crash Resilience**:
   - Out-of-the-box dynamic intelligence engine that ensures seamless operation even if API keys or quotas are not yet configured.

---

## 🏗️ Architecture & Tech Stack

```
Soci-Eye System
│
├── Frontend (React 18 + Vite + Vanilla CSS)
│   ├── Sticky Glassmorphic Navbar & Live Status
│   ├── Hero Section with Dynamic Search & Trending Chips
│   ├── Live-Monitoring AI Core Visualizer (Animated Signals, Particles)
│   ├── Multi-Stage AI Loading Pipeline
│   ├── Results Dashboard (100% Sentiment Balance, Aspect Rankings, Mentions, Grounded Insight)
│   ├── Analyzed Conversations Explorer (Filterable by Sentiment & Query)
│   └── API Keys Modal
│
└── Backend (FastAPI + Python 3.13)
    ├── YouTube Data API v3 Client (Video discovery & public comment retrieval)
    ├── Google Gemini API (Multilingual parsing, relevance filter, aspect extraction, insight synthesis)
    ├── Sentiment Aggregator (Exact 100% Hare-Niemeyer math, stopword pruning)
    └── Fallback Intelligence Engine (Dynamic domain adaptation)
```

---

## 📁 Project Structure

```
soci-eye/
├── backend/
│   ├── main.py              # FastAPI entrypoint, routing, CORS & error handlers
│   ├── config.py            # Settings, environment variables & status checks
│   ├── youtube.py           # YouTube Data API v3 video & comment fetcher
│   ├── ai_analysis.py       # Google Gemini AI prompts, structured JSON & relevance filter
│   ├── sentiment.py         # 100% percentage allocator & clean keyword extraction
│   ├── fallback_data.py     # Resilient dynamic topic intelligence engine
│   ├── test_backend.py      # Automated unittest verification suite
│   ├── requirements.txt     # Python backend dependencies
│   ├── .env.example         # Environment template
│   └── .env                 # API Keys (Git ignored)
├── frontend/
│   ├── index.html           # HTML template with Google Fonts
│   ├── package.json         # React & Vite dependencies
│   ├── vite.config.js       # Vite dev configuration
│   ├── .env.example         # Frontend environment template
│   ├── .env                 # Frontend API configuration
│   └── src/
│       ├── main.jsx         # React DOM root
│       ├── App.jsx          # Master application orchestrator
│       ├── App.css          # Full-stack UI design system
│       ├── index.css        # Global CSS tokens & animations
│       ├── services/
│       │   └── api.js       # Backend communication service
│       └── components/
│           ├── Navbar.jsx
│           ├── Hero.jsx
│           ├── SearchBar.jsx
│           ├── LiveMonitoringVisual.jsx
│           ├── LoadingState.jsx
│           ├── ResultsDashboard.jsx
│           ├── SentimentCards.jsx
│           ├── KeyTopics.jsx
│           ├── TopMentions.jsx
│           ├── AIInsightCard.jsx
│           ├── ConversationExplorer.jsx
│           ├── FeaturesSection.jsx
│           ├── HowItWorks.jsx
│           ├── CallToAction.jsx
│           ├── Footer.jsx
│           └── ApiKeyModal.jsx
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

Create `backend/.env`:

```env
# Google YouTube Data API v3 Key
# https://console.cloud.google.com/apis/credentials
YOUTUBE_API_KEY=your_youtube_api_key_here

# Google Gemini API Key
# https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Optional Limits
MAX_VIDEOS=5
MAX_COMMENTS_PER_VIDEO=20
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

---

## 🚀 Quickstart & How to Run

### Step 1: Install Dependencies

#### Backend:
```bash
cd backend
python -m pip install -r requirements.txt
```

#### Frontend:
```bash
cd ../frontend
npm install
```

---

### Step 2: Start the Backend Server

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```
*Backend runs at:* **`http://localhost:8000`**  
*Swagger Documentation:* **`http://localhost:8000/docs`**

---

### Step 3: Start the Frontend Application

```bash
cd frontend
npm run dev
```
*Frontend runs at:* **`http://localhost:5173`**

---

## 🧪 Testing

Run the automated backend test suite:

```bash
cd backend
python test_backend.py
```

Tests verified:
- `GET /api/health` system state
- `GET /api/analyze?topic=KFC`
- `GET /api/analyze?topic=Samsung+S23`
- `GET /api/analyze?topic=Pizza`
- `GET /api/analyze?topic=BTS`
- `GET /api/analyze?topic=Netflix`
- Empty query validation & error handling
- Sentiment 100% summation invariants

---

## 📡 API Reference

### `GET /api/analyze`

**Query Parameters:**
- `topic` (string, required): Brand, product, person or query string.

#### Example Request:
```bash
curl -X GET "http://localhost:8000/api/analyze?topic=KFC"
```

#### Example Response:
```json
{
  "topic": "KFC",
  "analysis": {
    "positive": 52,
    "neutral": 28,
    "negative": 20,
    "posts_analyzed": 52,
    "key_topics": [
      {
        "name": "Taste",
        "mentions": 18,
        "sentiment": "Positive"
      },
      {
        "name": "Price",
        "mentions": 14,
        "sentiment": "Negative"
      },
      {
        "name": "Crispiness",
        "mentions": 9,
        "sentiment": "Positive"
      }
    ],
    "top_mentions": [
      "chicken",
      "crispy",
      "zinger",
      "bucket",
      "taste",
      "price"
    ],
    "insight": "Public conversation around KFC is mixed with 52% positive sentiment. Positive discussion is driven mainly by taste and crispiness, while negative discussion is concentrated around pricing.",
    "posts": [
      {
        "id": "comment_1",
        "comment": "Hot & crispy chicken is unbeatable, specially with peri peri sprinkle",
        "sentiment": "Positive",
        "aspect": "Taste",
        "relevant": true,
        "reason": "Positive feedback highlighting taste",
        "channel": "FoodieNation",
        "video_title": "Deep Dive: KFC In-Depth Review",
        "video_url": "https://www.youtube.com/watch?v=...",
        "likes": 45
      }
    ]
  }
}
```

---

## 📸 Screenshots & UI Experience

*Soci-Eye features a dark, futuristic SaaS aesthetic tailored with glassmorphism, animated AI Core radar visualization, live signal feeds, and responsive layout across desktop and mobile screens.*

---

## 🔮 Future Improvements

- [ ] Reddit and Twitter/X sentiment connectors.
- [ ] Historical longitudinal database storing daily sentiment tracking over 30/90 days.
- [ ] Exportable PDF executive reports.
- [ ] Webhook alert triggers when negative sentiment crosses critical threshold.

---

## 📄 License

MIT License © 2024 Soci-Eye Team.
