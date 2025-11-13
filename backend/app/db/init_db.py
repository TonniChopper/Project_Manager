"""
Database initialization script.
Auto-creates tables if not present and provides bootstrap functionality.
"""
from sqlalchemy import inspect
from .base import Base
from .session import engine
from .models import User, Project, Task, Channel, Message  # noqa: F401 - ensure all models are registered
from ..core.logging import logger


def init_db() -> None:
    """
    Initialize database: create all tables if they don't exist.
    Call this at application startup or manually via script.
    """
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()

    logger.info(f"Existing tables: {existing_tables}")

    # Create all tables from Base metadata
    Base.metadata.create_all(bind=engine)

    logger.info("Database initialized successfully. All tables created or verified.")


def drop_all() -> None:
    """
    Drop all tables (USE WITH CAUTION - for testing only).
    """
    logger.warning("Dropping all database tables...")
    Base.metadata.drop_all(bind=engine)
    logger.info("All tables dropped.")


if __name__ == "__main__":
    init_db()

