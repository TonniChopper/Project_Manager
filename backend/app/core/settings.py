from functools import lru_cache
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyUrl, field_validator

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

    # WebSocket configuration
    WS_MAX_CONNECTIONS_PER_USER: int = 5
    WS_HEARTBEAT_INTERVAL: int = 30  # seconds
    WS_MESSAGE_MAX_SIZE: int = 1024 * 1024  # 1MB

    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v

    @field_validator('FRONTEND_URL', 'N8N_URL', 'AI_SERVICE_URL', mode='before')
    @classmethod
    def parse_optional_url(cls, v: Union[str, None]) -> Union[str, None]:
        if v == '' or v is None:
            return None
        return v

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)

@lru_cache
def get_settings() -> Settings:
    return Settings()
