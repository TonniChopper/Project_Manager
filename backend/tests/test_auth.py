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


def test_refresh_flow(client: TestClient):
    # Use existing user
    r = client.post("/api/v1/auth/login", json={"username": "alice", "password": "Secret123"})
    assert r.status_code == 200
    data = r.json()
    refresh = data["refresh_token"]
    r2 = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh})
    assert r2.status_code == 200
    data2 = r2.json()
    assert data2["access_token"] != data["access_token"]


def test_login_fail(client: TestClient):
    r = client.post("/api/v1/auth/login", json={"username": "alice", "password": "wrong"})
    assert r.status_code == 401
