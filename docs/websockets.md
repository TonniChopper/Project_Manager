[← Back to Index](./INDEX.md)

# WebSocket API and Implementation

This page consolidates the API contract and the implementation details for the real-time WebSocket layer.

## Overview
Endpoint: `ws://localhost:8000/api/v1/ws/connect?token=YOUR_JWT`
Authentication: JWT access token (query parameter). In production, token can be derived from HttpOnly cookie on the client side and appended manually.

## Room Format Validation
Allowed prefixes: `channel`, `project`, `task`. Room identifier must match `<prefix>:<numeric_id>`.
Invalid formats trigger an `error` event or close code 4403 on join attempt.

## Added Access Control Stub
Server currently performs prefix validation only (placeholder for future permission checks per project/channel/task membership).

Features:
- Rooms (project, channel, task)
- Broadcast events (task/message/project/system)
- Redis pub/sub scaling, in-memory fallback
- Per-user connection limit (default 5)
- Lifecycle, error, and security logging

---

## Connection Flow

```javascript
const token = "eyJhbGc...";
const ws = new WebSocket(`ws://localhost:8000/api/v1/ws/connect?token=${token}`);
ws.onopen = () => console.log("Connected");
ws.onmessage = (e) => console.log(JSON.parse(e.data));
ws.onerror = (e) => console.error(e);
ws.onclose = (e) => console.log(`Closed: ${e.code} - ${e.reason}`);
```

Welcome message example:
```json
{
  "type": "connected",
  "data": {"message": "Connected successfully", "user_id": 12345, "username": "alice"},
  "timestamp": "2025-11-13T12:00:00.000000Z"
}
```

---

## Client → Server Messages

Envelope:
```json
{"type": "join_room", "room": "project:123", "data": {"extra":"value"}}
```

Examples:
- Join room: `{ "type": "join_room", "room": "channel:456" }`
- Leave room: `{ "type": "leave_room", "room": "channel:456" }`
- Send message: `{ "type": "send_message", "room":"channel:456", "data": {"content":"Hello"} }`
- Ping: `{ "type": "ping" }`

---

## Server → Client Events

Event types:
- Chat: `message`, `message.edited`, `message.deleted`
- Task: `task.created`, `task.updated`, `task.status_changed`, `task.assigned`, `task.deleted`
- Project: `project.updated`, `project.archived`
- System: `user_joined`, `user_left`, `notification.new`, `error`

Event envelope:
```json
{"type":"event_type","room":"room_identifier","data":{"key":"value"},"sender":"username","timestamp":"2025-11-13T12:00:00Z"}
```

---

## Rooms and Access Control

Identifier: `{entity}:{id}` e.g. `project:123`, `channel:456`, `task:789`, `user:42`
- Access is verified per room; unauthorized join → 4403 Forbidden

---

## Error Codes

- 4401 Authentication Failed
- 4403 Forbidden
- 4429 Too Many Connections (limit 5)
- 4500 Internal Server Error

Error format:
```json
{"type": "error", "data": {"error":"Description"}, "timestamp": "..."}
```

---

## Best Practices (Client)

- Reconnect with backoff
- Send heartbeats every 30s
- Queue messages while offline and flush on open

---

## Implementation Summary

### Endpoint
File: `backend/app/api/ws.py`
- Single endpoint `/api/v1/ws/connect`
- JWT validation on upgrade
- Lifecycle logging
- Error codes as above

### Connection Manager
File: `backend/app/services/ws_service.py`
- Multi-connection per user
- Rooms: project/channel/task
- Redis pub/sub; in-memory fallback
- Cleanup on disconnect

### Events Integration
File: `backend/app/services/ws_events.py`
- Helpers to broadcast task/project/message events to rooms
- Type-safe event payloads

### Settings
`backend/app/core/settings.py`
- `WS_MAX_CONNECTIONS_PER_USER=5`
- `WS_HEARTBEAT_INTERVAL=30`
- `WS_MESSAGE_MAX_SIZE=1048576`

---

## Scaling with Redis
- Publish to `ws:events` channel
- Each instance subscribes and rebroadcasts to local connections
- Stateless horizontally scalable design

Env:
```env
REDIS_URL=redis://localhost:6379/0
```

---

## Examples

Manual client snippet and example events are compatible with sections above. See repository `ws_test_client.py` for an interactive tester.

---

## Testing

- Manual: `wscat -c "ws://localhost:8000/api/v1/ws/connect?token=JWT"`
- Automated: `pytest backend/tests/test_ws.py -v`

---

## Security Notes
- JWT required, permissions enforced on join
- Per-user connection limits
- Input validation and logging

---

## Troubleshooting
- Connection refused: check token, URL, server logs
- No messages: ensure `join_room` was sent and authorized
- Frequent disconnects: add heartbeats and reconnection logic

---

Last Updated: 2025-11-14
