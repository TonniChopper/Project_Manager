"""
WebSocket API for real-time communication.
Supports JWT authentication, room-based messaging, and event broadcasting.
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from typing import Optional
import json
from ..core.security import verify_token
from ..core.logging import logger
from ..services.ws_service import (
    ConnectionManager,
    authenticate_websocket,
    process_client_message,
    get_connection_manager
)

router = APIRouter()


@router.websocket("/connect")
async def websocket_endpoint(
    websocket: WebSocket,
    token: Optional[str] = Query(None),
):
    """
    Main WebSocket endpoint for real-time communication.

    Authentication via query param ?token=JWT_TOKEN

    Message format (client -> server):
    {
        "type": "join_room" | "leave_room" | "send_message" | "ping",
        "room": "project:123" | "channel:456" | "task:789",
        "data": { ... }
    }

    Message format (server -> client):
    {
        "type": "message" | "task.created" | "task.updated" | "status.changed" | "notification" | "error",
        "room": "project:123",
        "data": { ... },
        "timestamp": "2025-11-13T12:00:00Z",
        "sender": "username"
    }

    Error codes:
    - 4401: Authentication failed
    - 4403: Forbidden (no access to room)
    - 4429: Too many connections
    - 4500: Internal server error
    """
    manager = get_connection_manager()
    user_id = None
    username = None

    # Authenticate
    if not token:
        await websocket.close(code=4401, reason="Missing token")
        logger.warning(f"WebSocket connection rejected: Missing token from {websocket.client}")
        return

    try:
        auth_result = await authenticate_websocket(token, websocket)
        if not auth_result:
            return
        user_id, username = auth_result
    except Exception as e:
        logger.error(f"WebSocket auth error: {e}")
        await websocket.close(code=4401, reason="Authentication failed")
        return

    # Accept connection
    try:
        await manager.connect(websocket, user_id, username)
        logger.info(f"WebSocket connected: user={username} (id={user_id})")

        # Send welcome message
        await manager.send_personal_message({
            "type": "connected",
            "data": {"message": "Connected successfully", "user_id": user_id, "username": username}
        }, websocket)

    except Exception as e:
        logger.error(f"Connection failed for user {username}: {e}")
        await websocket.close(code=4500, reason="Connection failed")
        return

    # Main message loop
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                await process_client_message(message, websocket, user_id, username, manager)
            except json.JSONDecodeError:
                await manager.send_personal_message({
                    "type": "error",
                    "data": {"error": "Invalid JSON format"}
                }, websocket)
            except Exception as e:
                logger.error(f"Error processing message from {username}: {e}")
                await manager.send_personal_message({
                    "type": "error",
                    "data": {"error": str(e)}
                }, websocket)

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: user={username}")
    except Exception as e:
        logger.error(f"WebSocket error for user {username}: {e}")
    finally:
        await manager.disconnect(websocket, user_id)
        logger.info(f"WebSocket cleanup completed for user={username}")
