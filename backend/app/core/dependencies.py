from collections.abc import Generator
from fastapi import Depends
from .settings import get_settings, Settings
from ..db.session import SessionLocal


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_app_settings() -> Settings:
    return get_settings()

SettingsDep = Depends(get_app_settings)

