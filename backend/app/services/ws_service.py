"""
WebSocket service layer: connection management, event broadcasting, Redis pub/sub.
"""
from typing import Dict, Set, Optional, Tuple
from fastapi import WebSocket
from datetime import datetime, timezone
import json
import asyncio
import redis.asyncio as aioredis
from ..core.settings import get_settings
from ..core.security import verify_token
from ..core.logging import logger

settings = get_settings()


class ConnectionManager:
    """
    Manages WebSocket connections, rooms, and event broadcasting.
    Supports Redis pub/sub for horizontal scaling across multiple instances.
    """

    def __init__(self):
        self.active_connections: Dict[int, Set[WebSocket]] = {}  # user_id -> set of websockets
        self.connection_user_map: Dict[WebSocket, int] = {}  # websocket -> user_id
        self.room_connections: Dict[str, Set[WebSocket]] = {}  # room_id -> set of websockets
        self.max_connections_per_user: int = 5
        self.redis: Optional[aioredis.Redis] = None
        self.pubsub: Optional[aioredis.client.PubSub] = None
        self.redis_listener_task: Optional[asyncio.Task] = None

    async def init_redis(self):
        """Initialize Redis connection for pub/sub."""
        try:
            self.redis = await aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
            self.pubsub = self.redis.pubsub()
            await self.pubsub.subscribe("ws:events")
            logger.info("Redis pub/sub initialized for WebSocket")

            # Start listener in background
            self.redis_listener_task = asyncio.create_task(self._redis_listener())
        except Exception as e:
            logger.warning(f"Redis pub/sub initialization failed: {e}. Using in-memory mode only.")
            self.redis = None

    async def _redis_listener(self):
        """Listen for Redis pub/sub events and broadcast to local connections."""
        if not self.pubsub:
            return
        try:
            async for message in self.pubsub.listen():
                if message["type"] == "message":
                    try:
                        event_data = json.loads(message["data"])
                        room = event_data.get("room")
                        if room:
                            await self._broadcast_to_room_local(room, event_data)
                    except Exception as e:
                        logger.error(f"Error processing Redis message: {e}")
        except asyncio.CancelledError:
            logger.info("Redis listener task cancelled")
        except Exception as e:
            logger.error(f"Redis listener error: {e}")

    async def connect(self, websocket: WebSocket, user_id: int, username: str):
        """Accept WebSocket connection and track user."""
        # Check max connections per user
        if user_id in self.active_connections:
            if len(self.active_connections[user_id]) >= self.max_connections_per_user:
                await websocket.close(code=4429, reason="Too many connections")
                raise Exception(f"User {username} exceeded max connections ({self.max_connections_per_user})")

        await websocket.accept()

        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
        self.connection_user_map[websocket] = user_id

        logger.info(f"User {username} (id={user_id}) connected. Total connections: {len(self.active_connections[user_id])}")

    async def disconnect(self, websocket: WebSocket, user_id: Optional[int] = None):
        """Remove WebSocket connection and clean up rooms."""
        if user_id is None:
            user_id = self.connection_user_map.get(websocket)

        if user_id and user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

        self.connection_user_map.pop(websocket, None)

        # Remove from all rooms
        for room, connections in list(self.room_connections.items()):
            if websocket in connections:
                connections.discard(websocket)
                if not connections:
                    del self.room_connections[room]

        logger.info(f"User {user_id} disconnected")

    async def join_room(self, websocket: WebSocket, room: str):
        """Add connection to a room."""
        if room not in self.room_connections:
            self.room_connections[room] = set()
        self.room_connections[room].add(websocket)
        logger.info(f"WebSocket joined room: {room}. Total in room: {len(self.room_connections[room])}")

    async def leave_room(self, websocket: WebSocket, room: str):
        """Remove connection from a room."""
        if room in self.room_connections:
            self.room_connections[room].discard(websocket)
            if not self.room_connections[room]:
                del self.room_connections[room]
            logger.info(f"WebSocket left room: {room}")

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send message to a specific websocket."""
        message["timestamp"] = datetime.now(timezone.utc).isoformat()
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Failed to send personal message: {e}")

    async def broadcast_to_room(self, room: str, message: dict, sender_username: Optional[str] = None):
        """
        Broadcast message to all connections in a room.
        Uses Redis pub/sub if available for multi-instance support.
        """
        message["timestamp"] = datetime.now(timezone.utc).isoformat()
        message["room"] = room
        if sender_username:
            message["sender"] = sender_username

        # Publish to Redis for other instances
        if self.redis:
            try:
                await self.redis.publish("ws:events", json.dumps(message))
            except Exception as e:
                logger.error(f"Failed to publish to Redis: {e}")

        # Broadcast to local connections
        await self._broadcast_to_room_local(room, message)

    async def _broadcast_to_room_local(self, room: str, message: dict):
        """Broadcast to local connections only."""
        if room not in self.room_connections:
            return

        disconnected = []
        for connection in self.room_connections[room]:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Failed to send to connection in room {room}: {e}")
                disconnected.append(connection)

        # Clean up disconnected
        for conn in disconnected:
            user_id = self.connection_user_map.get(conn)
            await self.disconnect(conn, user_id)

    async def broadcast_to_user(self, user_id: int, message: dict):
        """Send message to all connections of a specific user."""
        message["timestamp"] = datetime.now(timezone.utc).isoformat()

        if user_id not in self.active_connections:
            return

        disconnected = []
        for connection in self.active_connections[user_id]:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Failed to send to user {user_id}: {e}")
                disconnected.append(connection)

        for conn in disconnected:
            await self.disconnect(conn, user_id)

    async def get_room_members_count(self, room: str) -> int:
        """Get number of connections in a room."""
        return len(self.room_connections.get(room, set()))

    async def close(self):
        """Cleanup resources."""
        if self.redis_listener_task:
            self.redis_listener_task.cancel()
            try:
                await self.redis_listener_task
            except asyncio.CancelledError:
                pass

        if self.pubsub:
            await self.pubsub.unsubscribe("ws:events")
            await self.pubsub.close()

        if self.redis:
            await self.redis.close()

        logger.info("ConnectionManager closed")


# Global instance
_connection_manager: Optional[ConnectionManager] = None


def get_connection_manager() -> ConnectionManager:
    """Get or create global ConnectionManager instance."""
    global _connection_manager
    if _connection_manager is None:
        _connection_manager = ConnectionManager()
        # Initialize Redis in background
        asyncio.create_task(_connection_manager.init_redis())
    return _connection_manager


async def authenticate_websocket(token: str, websocket: WebSocket) -> Optional[Tuple[int, str]]:
    """
    Authenticate WebSocket connection using JWT.
    Returns (user_id, username) or None on failure.
    """
    try:
        payload = verify_token(token, token_type="access")
        username = payload.get("sub")

        if not username:
            await websocket.close(code=4401, reason="Invalid token: no subject")
            return None

        # For now, use username as user_id (will be replaced with DB lookup)
        from ..core.security import _fake_users
        user = _fake_users.get(username)

        if not user:
            await websocket.close(code=4401, reason="User not found")
            logger.warning(f"WebSocket auth failed: user {username} not found")
            return None

        # Mock user_id (in production, fetch from DB)
        user_id = hash(username) % 1000000  # temporary ID generation

        return user_id, username

    except Exception as e:
        await websocket.close(code=4401, reason=f"Authentication failed: {str(e)}")
        logger.warning(f"WebSocket authentication error: {e}")
        return None


async def process_client_message(
    message: dict,
    websocket: WebSocket,
    user_id: int,
    username: str,
    manager: ConnectionManager
):
    """
    Process incoming client message and route to appropriate handler.

    Supported message types:
    - join_room: Join a room (project:ID, channel:ID, task:ID)
    - leave_room: Leave a room
    - send_message: Send message to room
    - ping: Heartbeat
    """
    msg_type = message.get("type")
    room = message.get("room")
    data = message.get("data", {})

    logger.debug(f"Processing message from {username}: type={msg_type}, room={room}")

    if msg_type == "join_room":
        if not room:
            await manager.send_personal_message({
                "type": "error",
                "data": {"error": "Room ID required"}
            }, websocket)
            return

        # TODO: Check user access to room (project, channel, task permissions)
        await manager.join_room(websocket, room)
        await manager.send_personal_message({
            "type": "joined_room",
            "room": room,
            "data": {"message": f"Joined room {room}"}
        }, websocket)

        # Notify room members
        await manager.broadcast_to_room(room, {
            "type": "user_joined",
            "data": {"username": username, "user_id": user_id}
        }, sender_username=username)

    elif msg_type == "leave_room":
        if not room:
            await manager.send_personal_message({
                "type": "error",
                "data": {"error": "Room ID required"}
            }, websocket)
            return

        await manager.leave_room(websocket, room)
        await manager.send_personal_message({
            "type": "left_room",
            "room": room,
            "data": {"message": f"Left room {room}"}
        }, websocket)

        # Notify room members
        await manager.broadcast_to_room(room, {
            "type": "user_left",
            "data": {"username": username, "user_id": user_id}
        }, sender_username=username)

    elif msg_type == "send_message":
        if not room:
            await manager.send_personal_message({
                "type": "error",
                "data": {"error": "Room ID required"}
            }, websocket)
            return

        # Broadcast message to room
        await manager.broadcast_to_room(room, {
            "type": "message",
            "data": {
                "content": data.get("content", ""),
                "username": username,
                "user_id": user_id,
                **data
            }
        }, sender_username=username)

        # TODO: Persist message to DB if it's a channel message

    elif msg_type == "ping":
        await manager.send_personal_message({
            "type": "pong",
            "data": {"timestamp": datetime.now(timezone.utc).isoformat()}
        }, websocket)

    else:
        await manager.send_personal_message({
            "type": "error",
            "data": {"error": f"Unknown message type: {msg_type}"}
        }, websocket)


async def broadcast_event(event_type: str, room: str, data: dict, sender_username: Optional[str] = None):
    """
    Broadcast event to all clients in a room.

    Event types:
    - task.created, task.updated, task.deleted, task.status_changed
    - message.new, message.edited, message.deleted
    - project.updated, project.archived
    - notification.new
    """
    manager = get_connection_manager()
    await manager.broadcast_to_room(room, {
        "type": event_type,
        "data": data
    }, sender_username=sender_username)

    logger.info(f"Event broadcast: {event_type} to room {room}")


async def notify_user(user_id: int, notification_type: str, data: dict):
    """Send notification to specific user across all their connections."""
    manager = get_connection_manager()
    await manager.broadcast_to_user(user_id, {
        "type": f"notification.{notification_type}",
        "data": data
    })

    logger.info(f"Notification sent to user {user_id}: {notification_type}")

