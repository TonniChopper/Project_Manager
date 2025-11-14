import pytest
from backend.app.core import security


def create_db_user(db_client, username: str, password: str, role: str = "user"):
    # call register endpoint to create DB user via router
    r = db_client.post("/api/v1/users/", json={"username": username, "password": password, "email": f"{username}@test.com"})
    assert r.status_code == 201
    return r.json()


def auth_headers_for(username: str):
    # register fake user in security and produce token
    security.register_fake_user(username, "password", role="user")
    token = security.create_access_token(username)
    return {"Authorization": f"Bearer {token}"}


def test_create_and_get_user(client):
    # create user via API
    res = client.post("/api/v1/users/", json={"username": "alice", "password": "secret", "email": "alice@test.com"})
    assert res.status_code == 201, f"Expected 201, got {res.status_code}: {res.text}"
    data = res.json()
    assert data["username"] == "alice"


def test_list_users_requires_admin(client):
    # ensure non-admin cannot list users
    security.register_fake_user("bob", "pw", role="user")
    token = security.create_access_token("bob")
    res = client.get("/api/v1/users/", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 403

    # admin can list
    security.register_fake_user("admin", "pw", role="admin")
    token = security.create_access_token("admin")
    res = client.get("/api/v1/users/", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200

