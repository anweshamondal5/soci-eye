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
        if not self.api_key:
            logger.warning("YouTube API key is missing.")
            return []

        url = f"{self.base_url}/search"
        params = {
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": min(max_results, 10),
            "order": "relevance",
            "key": self.api_key
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params)
                
                if response.status_code == 403:
                    error_data = response.json().get("error", {})
                    message = error_data.get("message", "YouTube API quota exceeded or unauthorized.")
                    logger.error(f"YouTube API 403 Forbidden: {message}")
                    raise RuntimeError(f"YouTube API quota exceeded or key invalid: {message}")

                response.raise_for_status()
                data = response.json()

                videos = []
                for item in data.get("items", []):
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
        except httpx.HTTPStatusError as exc:
            logger.error(f"HTTP error searching YouTube: {exc}")
            raise
        except Exception as exc:
            logger.error(f"Error fetching YouTube videos: {exc}")
            raise

    async def get_video_comments(self, video_id: str, video_title: str, channel_title: str, max_comments: int = 20) -> List[Dict[str, Any]]:
        """
        Retrieve public top-level comments for a given video ID.
        Gracefully handles disabled comments and API limits.
        """
        if not self.api_key:
            return []

        url = f"{self.base_url}/commentThreads"
        params = {
            "part": "snippet",
            "videoId": video_id,
            "maxResults": min(max_comments, 50),
            "textFormat": "plainText",
            "order": "relevance",
            "key": self.api_key
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params)
                
                # Check for comments disabled or 403 on comments
                if response.status_code in (403, 404):
                    err_json = response.json().get("error", {})
                    errors = err_json.get("errors", [])
                    reasons = [e.get("reason") for e in errors]
                    if "commentsDisabled" in reasons or "processingFailure" in reasons:
                        logger.info(f"Comments are disabled for video {video_id}.")
                        return []
                    # Otherwise log warning and continue
                    logger.warning(f"Failed to get comments for {video_id}: {err_json.get('message')}")
                    return []

                response.raise_for_status()
                data = response.json()

                comments = []
                for item in data.get("items", []):
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
            logger.warning(f"Skipping comments for video {video_id} due to: {exc}")
            return []

    async def fetch_social_conversations(self, topic: str, max_videos: int = 5, max_comments_per_video: int = 20) -> List[Dict[str, Any]]:
        """
        Complete pipeline: Search videos for a topic and collect all public comments.
        """
        videos = await self.search_videos(topic, max_results=max_videos)
        if not videos:
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

        logger.info(f"Retrieved {len(all_comments)} comments across {len(videos)} videos for topic '{topic}'.")
        return all_comments

youtube_service = YouTubeService()
