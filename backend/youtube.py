import logging
from typing import List, Dict, Any, Optional
import httpx
from config import settings

logger = logging.getLogger("soci-eye.youtube")

class YouTubeService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.YOUTUBE_API_KEY
        self.base_url = "https://www.googleapis.com/youtube/v3"

    async def search_videos(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """
        Search for YouTube videos matching the given query topic.
        Returns a list of video metadata dictionaries.
        """
        key = self.api_key or settings.YOUTUBE_API_KEY
        if not key:
            logger.warning("[YouTube] No API key configured.")
            return []

        url = f"{self.base_url}/search"
        params = {
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": min(max_results, 10),
            "order": "relevance",
            "key": key
        }

        logger.info(f"[YouTube] Initiating video search for query: '{query}'")
        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                response = await client.get(url, params=params)
                
                if response.status_code != 200:
                    try:
                        err_json = response.json()
                        err_msg = err_json.get("error", {}).get("message", response.text[:200])
                    except Exception:
                        err_msg = response.text[:200]
                    logger.error(f"[YouTube] Search request failed with HTTP {response.status_code}: {err_msg}")
                    return []

                data = response.json()
                items = data.get("items", [])
                logger.info(f"[YouTube] Search succeeded: {len(items)} videos found.")

                videos = []
                for item in items:
                    id_obj = item.get("id", {})
                    video_id = id_obj.get("videoId")
                    snippet = item.get("snippet", {})
                    
                    if video_id:
                        videos.append({
                            "video_id": video_id,
                            "title": snippet.get("title", ""),
                            "description": snippet.get("description", ""),
                            "channel_title": snippet.get("channelTitle", ""),
                            "published_at": snippet.get("publishedAt", ""),
                            "thumbnail": snippet.get("thumbnails", {}).get("high", {}).get("url", ""),
                            "video_url": f"https://www.youtube.com/watch?v={video_id}"
                        })
                return videos
        except Exception as exc:
            logger.error(f"[YouTube] Exception during video search: {exc}")
            return []

    async def get_video_comments(self, video_id: str, video_title: str, channel_title: str, max_comments: int = 20) -> List[Dict[str, Any]]:
        """
        Retrieve public top-level comments for a given video ID.
        Gracefully handles disabled comments and API limits.
        """
        key = self.api_key or settings.YOUTUBE_API_KEY
        if not key:
            return []

        url = f"{self.base_url}/commentThreads"
        params = {
            "part": "snippet",
            "videoId": video_id,
            "maxResults": min(max_comments, 50),
            "textFormat": "plainText",
            "order": "relevance",
            "key": key
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params)
                
                if response.status_code in (403, 404):
                    try:
                        err_json = response.json().get("error", {})
                        reasons = [e.get("reason") for e in err_json.get("errors", [])]
                        if "commentsDisabled" in reasons or "processingFailure" in reasons:
                            logger.info(f"[YouTube] Comments disabled on video {video_id}.")
                            return []
                        logger.warning(f"[YouTube] Comment retrieval returned HTTP {response.status_code}: {err_json.get('message')}")
                    except Exception:
                        pass
                    return []

                if response.status_code != 200:
                    logger.warning(f"[YouTube] CommentThreads for {video_id} returned HTTP {response.status_code}")
                    return []

                data = response.json()
                items = data.get("items", [])
                comments = []
                for item in items:
                    top_comment = item.get("snippet", {}).get("topLevelComment", {}).get("snippet", {})
                    text = top_comment.get("textDisplay", "").strip()
                    author = top_comment.get("authorDisplayName", "Anonymous")
                    likes = top_comment.get("likeCount", 0)
                    published_at = top_comment.get("publishedAt", "")

                    if text:
                        comments.append({
                            "comment_id": item.get("id", ""),
                            "text": text,
                            "author": author,
                            "likes": likes,
                            "published_at": published_at,
                            "video_id": video_id,
                            "video_title": video_title,
                            "channel_title": channel_title,
                            "video_url": f"https://www.youtube.com/watch?v={video_id}"
                        })
                return comments
        except Exception as exc:
            logger.warning(f"[YouTube] Skipping comments for video {video_id} due to: {exc}")
            return []

    async def fetch_social_conversations(self, topic: str, max_videos: int = 5, max_comments_per_video: int = 20) -> List[Dict[str, Any]]:
        """
        Complete pipeline: Search videos for a topic and collect all public comments.
        """
        videos = await self.search_videos(topic, max_results=max_videos)
        if not videos:
            logger.warning(f"[YouTube] No videos retrieved for topic '{topic}'.")
            return []

        all_comments = []
        for vid in videos:
            comments = await self.get_video_comments(
                video_id=vid["video_id"],
                video_title=vid["title"],
                channel_title=vid["channel_title"],
                max_comments=max_comments_per_video
            )
            all_comments.extend(comments)

        logger.info(f"[YouTube] Successfully retrieved {len(all_comments)} comments across {len(videos)} videos for '{topic}'.")
        return all_comments

youtube_service = YouTubeService()
