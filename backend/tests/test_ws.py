"""
WebSocket integration tests: authentication, rooms, events, broadcasting.
"""
import pytest
import json
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect


def test_websocket_requires_token(client: TestClient):
    """WebSocket connection without token should be rejected."""
    with pytest.raises(WebSocketDisconnect):
        with client.websocket_connect("/api/v1/ws/connect"):
            pass


def test_websocket_invalid_token(client: TestClient):
    """WebSocket connection with invalid token should be rejected."""
    with pytest.raises(WebSocketDisconnect):
        with client.websocket_connect("/api/v1/ws/connect?token=invalid_token"):
            pass


def test_websocket_connect_with_valid_token(client: TestClient):
    """WebSocket connection with valid token should succeed."""
    # Register and login
    client.post("/api/v1/auth/register", json={
        "username": "ws_user",
        "password": "Secret123",
        "email": "ws@test.com"
    })
    r = client.post("/api/v1/auth/login", json={"username": "ws_user", "password": "Secret123"})
    assert r.status_code == 200
    token = r.json()["access_token"]

    with client.websocket_connect(f"/api/v1/ws/connect?token={token}") as ws:
        # Should receive welcome message
        data = ws.receive_json()
        assert data["type"] == "connected"
        assert data["data"]["username"] == "ws_user"


def test_websocket_join_room(client: TestClient):
    """Test joining a room."""
    r = client.post("/api/v1/auth/login", json={"username": "ws_user", "password": "Secret123"})
    token = r.json()["access_token"]

    with client.websocket_connect(f"/api/v1/ws/connect?token={token}") as ws:
        # Receive welcome
        ws.receive_json()

        # Join room
        ws.send_json({
            "type": "join_room",
            "room": "channel:123"
        })

        # Should receive joined confirmation
        data = ws.receive_json()
        assert data["type"] == "joined_room"
        assert data["room"] == "channel:123"

        # Should receive user_joined broadcast
        data = ws.receive_json()
        assert data["type"] == "user_joined"
        assert data["data"]["username"] == "ws_user"


def test_websocket_send_message_to_room(client: TestClient):
    """Test sending message to a room."""
    r = client.post("/api/v1/auth/login", json={"username": "ws_user", "password": "Secret123"})
    token = r.json()["access_token"]

    with client.websocket_connect(f"/api/v1/ws/connect?token={token}") as ws:
        ws.receive_json()  # welcome

        # Join room
        ws.send_json({"type": "join_room", "room": "channel:123"})
        ws.receive_json()  # joined confirmation
        ws.receive_json()  # user_joined broadcast

        # Send message
        ws.send_json({
            "type": "send_message",
            "room": "channel:123",
            "data": {"content": "Hello world!"}
        })

        # Should receive the message broadcast
        data = ws.receive_json()
        assert data["type"] == "message"
        assert data["data"]["content"] == "Hello world!"
        assert data["data"]["username"] == "ws_user"


def test_websocket_leave_room(client: TestClient):
    """Test leaving a room."""
    r = client.post("/api/v1/auth/login", json={"username": "ws_user", "password": "Secret123"})
    token = r.json()["access_token"]

    with client.websocket_connect(f"/api/v1/ws/connect?token={token}") as ws:
        ws.receive_json()  # welcome

        # Join room
        ws.send_json({"type": "join_room", "room": "channel:123"})
        ws.receive_json()  # joined
        ws.receive_json()  # user_joined

        # Leave room
        ws.send_json({"type": "leave_room", "room": "channel:123"})

        # Should receive left confirmation
        data = ws.receive_json()
        assert data["type"] == "left_room"
        assert data["room"] == "channel:123"

        # Should receive user_left broadcast
        data = ws.receive_json()
        assert data["type"] == "user_left"


def test_websocket_ping_pong(client: TestClient):
    """Test ping/pong heartbeat."""
    r = client.post("/api/v1/auth/login", json={"username": "ws_user", "password": "Secret123"})
    token = r.json()["access_token"]

    with client.websocket_connect(f"/api/v1/ws/connect?token={token}") as ws:
        ws.receive_json()  # welcome

        # Send ping
        ws.send_json({"type": "ping"})

        # Should receive pong
        data = ws.receive_json()
        assert data["type"] == "pong"
        assert "timestamp" in data["data"]


def test_websocket_invalid_message_type(client: TestClient):
    """Test handling of invalid message type."""
    r = client.post("/api/v1/auth/login", json={"username": "ws_user", "password": "Secret123"})
    token = r.json()["access_token"]

    with client.websocket_connect(f"/api/v1/ws/connect?token={token}") as ws:
        ws.receive_json()  # welcome

        # Send invalid message type
        ws.send_json({"type": "invalid_type"})

        # Should receive error
        data = ws.receive_json()
        assert data["type"] == "error"
        assert "Unknown message type" in data["data"]["error"]


def test_websocket_missing_room(client: TestClient):
    """Test message without required room field."""
    r = client.post("/api/v1/auth/login", json={"username": "ws_user", "password": "Secret123"})
    token = r.json()["access_token"]

    with client.websocket_connect(f"/api/v1/ws/connect?token={token}") as ws:
        ws.receive_json()  # welcome

        # Send message without room
        ws.send_json({"type": "join_room"})

        # Should receive error
        data = ws.receive_json()
        assert data["type"] == "error"
        assert "Room ID required" in data["data"]["error"]


def test_websocket_multiple_rooms(client: TestClient):
    """Test joining multiple rooms simultaneously."""
    r = client.post("/api/v1/auth/login", json={"username": "ws_user", "password": "Secret123"})
    token = r.json()["access_token"]

    with client.websocket_connect(f"/api/v1/ws/connect?token={token}") as ws:
        ws.receive_json()  # welcome

        # Join first room
        ws.send_json({"type": "join_room", "room": "channel:1"})
        ws.receive_json()  # joined
        ws.receive_json()  # user_joined

        # Join second room
        ws.send_json({"type": "join_room", "room": "project:2"})
        ws.receive_json()  # joined
        ws.receive_json()  # user_joined

        # Send message to first room
        ws.send_json({
            "type": "send_message",
            "room": "channel:1",
            "data": {"content": "Message in channel"}
        })
        data = ws.receive_json()
        assert data["room"] == "channel:1"

        # Send message to second room
        ws.send_json({
            "type": "send_message",
            "room": "project:2",
            "data": {"content": "Message in project"}
        })
        data = ws.receive_json()
        assert data["room"] == "project:2"
