import logging
import time
from typing import Optional
from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import httpx

from config import settings
from youtube import youtube_service
from ai_analysis import ai_service
from fallback_data import generate_dynamic_fallback

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("soci-eye")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_TAGLINE,
    version=settings.VERSION
)

# Configure CORS for Vite React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://soci-eye-frontend.onrender.com",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_origin_regex=r"https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    topic: str = Field(..., min_length=1, description="Brand, product, person or topic to analyze")

@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "tagline": settings.PROJECT_TAGLINE,
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "has_youtube_key": settings.has_youtube_key,
        "has_gemini_key": settings.has_gemini_key,
        "timestamp": time.time()
    }

@app.get("/api/debug-pipeline")
async def debug_pipeline():
    """
    Diagnostic endpoint that executes real test calls to YouTube and Gemini
    and returns exact HTTP status codes and error messages (without exposing keys).
    """
    yt_key = settings.YOUTUBE_API_KEY
    gm_key = settings.GEMINI_API_KEY

    diagnostics = {
        "youtube_key_configured": bool(yt_key and not yt_key.startswith("YOUR_")),
        "youtube_key_prefix": yt_key[:4] + "..." if yt_key else "None",
        "gemini_key_configured": bool(gm_key and not gm_key.startswith("YOUR_")),
        "gemini_key_prefix": gm_key[:4] + "..." if gm_key else "None",
        "youtube_test": {},
        "gemini_test": {}
    }

    # Test YouTube
    if yt_key:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                yt_res = await client.get(
                    "https://www.googleapis.com/youtube/v3/search",
                    params={"part": "snippet", "q": "test", "type": "video", "maxResults": 1, "key": yt_key}
                )
                diagnostics["youtube_test"]["status_code"] = yt_res.status_code
                if yt_res.status_code == 200:
                    diagnostics["youtube_test"]["result"] = "SUCCESS: YouTube Data API is functional."
                else:
                    diagnostics["youtube_test"]["error"] = yt_res.json().get("error", {}).get("message", yt_res.text[:200])
        except Exception as exc:
            diagnostics["youtube_test"]["exception"] = str(exc)

    # Test Gemini
    if gm_key:
        try:
            headers = {"Content-Type": "application/json", "x-goog-api-key": gm_key}
            payload = {"contents": [{"parts": [{"text": "Reply with 'OK'"}]}]}
            async with httpx.AsyncClient(timeout=15.0) as client:
                gm_res = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gm_key}",
                    headers=headers,
                    json=payload
                )
                diagnostics["gemini_test"]["status_code"] = gm_res.status_code
                if gm_res.status_code == 200:
                    diagnostics["gemini_test"]["result"] = "SUCCESS: Gemini API is functional."
                else:
                    try:
                        diagnostics["gemini_test"]["error"] = gm_res.json().get("error", {}).get("message", gm_res.text[:200])
                    except Exception:
                        diagnostics["gemini_test"]["error"] = gm_res.text[:200]
        except Exception as exc:
            diagnostics["gemini_test"]["exception"] = str(exc)

    return diagnostics

@app.get("/api/analyze")
async def analyze_topic_get(topic: str = Query(..., min_length=1, description="Topic to analyze")):
    """
    Main GET endpoint: Analyzes public social conversations around any topic or brand.
    """
    clean_topic = topic.strip()
    if not clean_topic:
        raise HTTPException(status_code=400, detail="Search topic cannot be empty.")

    logger.info(f"Received analysis request for topic: '{clean_topic}'")

    try:
        if settings.has_youtube_key and settings.has_gemini_key:
            try:
                logger.info(f"[Pipeline] Starting live retrieval for '{clean_topic}' using YouTube and Gemini...")
                raw_comments = await youtube_service.fetch_social_conversations(
                    topic=clean_topic,
                    max_videos=settings.MAX_VIDEOS,
                    max_comments_per_video=settings.MAX_COMMENTS_PER_VIDEO
                )
                if raw_comments:
                    logger.info(f"[Pipeline] Passing {len(raw_comments)} YouTube comments to Gemini...")
                    result = await ai_service.analyze_social_intelligence(clean_topic, raw_comments)
                    return result
                else:
                    logger.warning(f"[Pipeline] YouTube returned 0 comments for '{clean_topic}'. Using dynamic intelligence.")
                    fallback = generate_dynamic_fallback(clean_topic)
                    fallback["debug_pipeline_note"] = "YouTube search returned 0 comments or API rejected request."
                    return fallback
            except Exception as live_err:
                logger.error(f"[Pipeline] Live pipeline error: {live_err}. Applying dynamic fallback.", exc_info=True)
                fallback = generate_dynamic_fallback(clean_topic)
                fallback["debug_pipeline_note"] = f"Pipeline exception: {type(live_err).__name__}: {str(live_err)}"
                return fallback
        else:
            logger.info("[Pipeline] Live API keys not configured. Serving dynamic topic intelligence engine.")
            return generate_dynamic_fallback(clean_topic)

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Unexpected server error during analysis: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "error": "Analysis temporarily unavailable",
                "message": "We were unable to complete the analysis for this topic. Please try again shortly."
            }
        )

@app.post("/api/analyze")
async def analyze_topic_post(req: AnalyzeRequest):
    """
    POST endpoint alternative for topic analysis.
    """
    return await analyze_topic_get(topic=req.topic)

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "A server error occurred while processing your request. Please try again."
        }
    )

if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
