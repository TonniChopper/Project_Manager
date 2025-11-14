import pytest
from backend.app.core import security


def register_and_auth(client, username: str, role: str = "user"):
    # create DB user and register fake user for token
    res = client.post("/api/v1/users/", json={"username": username, "password": "pw", "email": f"{username}@test.com"})
    assert res.status_code == 201, f"User creation failed: {res.text}"
    security.register_fake_user(username, "pw", role=role)
    token = security.create_access_token(username)
    return {"Authorization": f"Bearer {token}"}


def test_project_crud_happy_path(client):
    headers = register_and_auth(client, "proj_owner")
    # create
    payload = {"name": "Test Project", "description": "desc"}
    r = client.post("/api/v1/projects/", json=payload, headers=headers)
    assert r.status_code == 201
    proj = r.json()
    assert proj["name"] == "Test Project"
    pid = proj["id"]
    # get
    r = client.get(f"/api/v1/projects/{pid}")
    assert r.status_code == 200
    # update
    r = client.put(f"/api/v1/projects/{pid}", json={"name": "Renamed"}, headers=headers)
    assert r.status_code == 200
    assert r.json()["name"] == "Renamed"
    # delete (archive)
    r = client.delete(f"/api/v1/projects/{pid}", headers=headers)
    assert r.status_code == 204


@pytest.mark.parametrize("payload", [
    ({"description": "no name"}),
    ({}),
])
def test_project_create_missing_fields(client, payload):
    security.register_fake_user("u1", "pw")
    token = security.create_access_token("u1")
    r = client.post("/api/v1/projects/", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert r.status_code in (400, 422)

