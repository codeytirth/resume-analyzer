import os
from pathlib import Path

from dotenv import load_dotenv

from app.exceptions.errors import MissingApiKeyError

# Load environment variables from the project root .env file.
# The API key must live in .env only — never in source code.
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
load_dotenv(PROJECT_ROOT / ".env")


class Settings:
    """Central configuration for the FastAPI backend."""

    groq_model: str = "llama-3.3-70b-versatile"
    requirement_file: Path = PROJECT_ROOT / "requirement.json"
    project_root: Path = PROJECT_ROOT

    def get_groq_api_key(self) -> str:
        """Read the Groq API key from the environment at runtime."""
        api_key = os.getenv("GROQ_API_KEY", "").strip()
        if not api_key:
            raise MissingApiKeyError(
                "GROQ_API_KEY is not configured. Add it to your .env file."
            )
        return api_key

    @property
    def database_url(self) -> str:
        """Read DATABASE_URL from environment; fallback to local SQLite DB."""
        db_url = os.getenv("DATABASE_URL", "").strip()
        if db_url:
            # Fix Vercel / Heroku postgres:// scheme for SQLAlchemy 1.4+
            if db_url.startswith("postgres://"):
                db_url = db_url.replace("postgres://", "postgresql://", 1)
            return db_url
        
        # Local SQLite database fallback
        local_db_path = self.project_root / "backend" / "resume_analyzer.db"
        return f"sqlite:///{local_db_path}"


settings = Settings()
