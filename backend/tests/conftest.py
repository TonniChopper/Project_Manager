# Mock Redis to avoid connection issues in tests
import sys
from unittest.mock import MagicMock

redis_mock = MagicMock()
sys.modules['redis'] = redis_mock
sys.modules['redis.asyncio'] = redis_mock

import pytest
from pathlib import Path
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Add project root to sys.path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from backend.app.main import app
from backend.app.core.dependencies import get_db
from backend.app.db.base import Base

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Create all tables before tests and drop after"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test"""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()

def override_get_db():
    """Override get_db dependency to use test database"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Override the dependency
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session")
def client() -> TestClient:
    return TestClient(app)

@pytest.fixture(scope="function")
def test_user(client: TestClient):
    """Create a test user for authentication tests"""
    response = client.post(
        "/api/v1/auth/register",
        json={"username": "alice", "password": "Secret123", "email": "alice@example.com"}
    )
    if response.status_code == 201:
        return {"username": "alice", "password": "Secret123", "email": "alice@example.com"}
    # User might already exist, return anyway
    return {"username": "alice", "password": "Secret123", "email": "alice@example.com"}

