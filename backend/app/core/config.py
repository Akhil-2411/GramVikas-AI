import os
from pathlib import Path
from typing import List

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseModel as BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent
WORKSPACE_DIR = BASE_DIR.parent
DATASETS_DIR = WORKSPACE_DIR / "datasets"


class Settings(BaseSettings):
    PROJECT_NAME: str = "GramVikas AI - MSME Advisory Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Security
    JWT_SECRET: str = os.getenv(
        "JWT_SECRET",
        "super-secret-gramvikas-sih2026-key-change-in-production"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{BASE_DIR}/gramvikas.db"
    )

    # External APIs
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "https://*.vercel.app",
        "*"
    ]

    # Dataset file paths
    DISTRICT_MSME_CSV: str = str(DATASETS_DIR / "district_msme_final.csv")
    VILLAGE_CENTROIDS_CSV: str = str(DATASETS_DIR / "telangana_village_centroids.csv")
    CLEANED_MSME_XLS: str = str(DATASETS_DIR / "cleaned_msme_final.xls")
    TELANGANA_GEOJSON: str = str(DATASETS_DIR / "telangana_villages.geojson")

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"


settings = Settings()

# Debug Logs
print("=" * 60)
print("GRAMVIKAS CONFIG LOADED")
print("ENVIRONMENT:", settings.ENVIRONMENT)
print("DATABASE_URL:", settings.DATABASE_URL)

print("GEMINI KEY LOADED:", bool(settings.GEMINI_API_KEY))

if settings.GEMINI_API_KEY:
    print("GEMINI KEY PREFIX:", settings.GEMINI_API_KEY[:10] + "...")
else:
    print("GEMINI API KEY NOT FOUND")

print("=" * 60)