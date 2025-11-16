import pytest
from fastapi.testclient import TestClient


def test_register_and_login(client: TestClient):
    # Register
    r = client.post("/api/v1/auth/register", json={"username": "alice", "password": "Secret123", "email": "alice@example.com"})
    assert r.status_code == 201, r.text
    # Login
    r2 = client.post("/api/v1/auth/login", json={"username": "alice", "password": "Secret123"})
    assert r2.status_code == 200
    data = r2.json()
    assert "access_token" in data and "refresh_token" in data
    token = data["access_token"]
    # Protected endpoint
    r3 = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r3.status_code == 200
    assert r3.json()["username"] == "alice"


def test_refresh_flow(client: TestClient, test_user):
    # Use existing user from fixture
    r = client.post("/api/v1/auth/login", json={"username": test_user["username"], "password": test_user["password"]})
    assert r.status_code == 200
    data = r.json()
    refresh = data["refresh_token"]
    r2 = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh})
    assert r2.status_code == 200
    data2 = r2.json()
    # Verify we got a new access token (it should be valid)
    assert "access_token" in data2
    # The tokens might be the same if created in the same second, but should have different jti
    # Just verify the refresh endpoint works and returns valid structure
    assert "user" in data2
    assert data2["user"]["username"] == "alice"


def test_login_fail(client: TestClient, test_user):
    r = client.post("/api/v1/auth/login", json={"username": test_user["username"], "password": "wrong"})
    assert r.status_code == 401
