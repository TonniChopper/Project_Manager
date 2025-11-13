import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

@pytest.fixture(scope="session")
def client() -> TestClient:
    return TestClient(app)

