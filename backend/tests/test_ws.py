import pytest
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect


def test_websocket_requires_token(client: TestClient):
    with pytest.raises(WebSocketDisconnect):
        with client.websocket_connect("/api/v1/ws/echo?token=invalid"):
            pass


def test_websocket_echo(client: TestClient):
    r = client.post("/api/v1/auth/login", json={"username": "alice", "password": "Secret123"})
    assert r.status_code == 200
    token = r.json()["access_token"]
    with client.websocket_connect(f"/api/v1/ws/echo?token={token}") as ws:
        ws.send_text("hello")
        msg = ws.receive_text()
        assert msg == "echo: hello"
