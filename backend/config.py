import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from current directory or backend directory
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "Soci-Eye: AI-Powered Social Intelligence"
    PROJECT_TAGLINE: str = "Understand what people really think."
    VERSION: str = "1.0.0"
    
    YOUTUBE_API_KEY: str = os.getenv("YOUTUBE_API_KEY", "").strip().strip("'").strip('"')
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip().strip("'").strip('"')
    
    MAX_VIDEOS: int = int(os.getenv("MAX_VIDEOS", "5"))
    MAX_COMMENTS_PER_VIDEO: int = int(os.getenv("MAX_COMMENTS_PER_VIDEO", "20"))
    
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    @property
    def has_youtube_key(self) -> bool:
        return bool(self.YOUTUBE_API_KEY and not self.YOUTUBE_API_KEY.startswith("YOUR_"))

    @property
    def has_gemini_key(self) -> bool:
        return bool(self.GEMINI_API_KEY and not self.GEMINI_API_KEY.startswith("YOUR_"))

settings = Settings()
