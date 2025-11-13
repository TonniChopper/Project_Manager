from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyUrl

class Settings(BaseSettings):
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_TITLE: str = "Project Manager API"
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/project_manager"
    REDIS_URL: str = "redis://localhost:6379/0"
    JWT_SECRET: str = "changeme"  # override in .env
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    JWT_ISSUER: str = "project_manager"
    JWT_AUDIENCE: str = "project_manager_users"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    FRONTEND_URL: AnyUrl | None = None
    N8N_URL: AnyUrl | None = None
    AI_SERVICE_URL: AnyUrl | None = None
    SENTRY_DSN: str | None = None
    LOG_LEVEL: str = "info"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)

@lru_cache
def get_settings() -> Settings:
    return Settings()
