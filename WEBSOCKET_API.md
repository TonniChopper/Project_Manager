
# WebSocket API Documentation

## Overview
Real-time bidirectional communication for live chat, task updates, and notifications.

**Endpoint**: `ws://localhost:8000/api/v1/ws/connect?token=YOUR_JWT_TOKEN`

**Authentication**: JWT token passed as query parameter

**Features**:
- Room-based messaging (projects, channels, tasks)
- Event broadcasting with Redis pub/sub
- Horizontal scaling support
- Per-user connection limits
- Automatic reconnection support

---

## Connection Flow

### 1. Connect
```javascript
const token = "eyJhbGc..."; // Your JWT access token
const ws = new WebSocket(`ws://localhost:8000/api/v1/ws/connect?token=${token}`);

ws.onopen = () => {
  console.log("Connected");
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log("Received:", message);
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

ws.onclose = (event) => {
  console.log(`Closed: ${event.code} - ${event.reason}`);
};
```

### 2. Welcome Message
Upon successful connection:
```json
{
  "type": "connected",
  "data": {
    "message": "Connected successfully",
    "user_id": 12345,
    "username": "alice"
  },
  "timestamp": "2025-11-13T12:00:00.000000Z"
}
```

---

## Client → Server Messages

### Message Envelope
```json
{
  "type": "join_room | leave_room | send_message | ping",
  "room": "project:123 | channel:456 | task:789",
  "data": { ... }
}
```

### 1. Join Room
```json
{
  "type": "join_room",
  "room": "channel:456"
}
```

**Response**:
```json
{
  "type": "joined_room",
  "room": "channel:456",
  "data": {
    "message": "Joined room channel:456"
  },
  "timestamp": "2025-11-13T12:00:00Z"
}
```

**Broadcast to room**:
```json
{
  "type": "user_joined",
  "room": "channel:456",
  "data": {
    "username": "alice",
    "user_id": 12345
  },
  "sender": "alice",
  "timestamp": "2025-11-13T12:00:00Z"
}
```

### 2. Leave Room
```json
{
  "type": "leave_room",
  "room": "channel:456"
}
```

### 3. Send Message
```json
{
  "type": "send_message",
  "room": "channel:456",
  "data": {
    "content": "Hello everyone!",
    "metadata": {
      "reply_to": 789
    }
  }
}
```

**Broadcast to room**:
```json
{
  "type": "message",
  "room": "channel:456",
  "data": {
    "content": "Hello everyone!",
    "username": "alice",
    "user_id": 12345,
    "metadata": {
      "reply_to": 789
    }
  },
  "sender": "alice",
  "timestamp": "2025-11-13T12:00:00Z"
}
```

### 4. Ping (Heartbeat)
```json
{
  "type": "ping"
}
```

**Response**:
```json
{
  "type": "pong",
  "data": {
    "timestamp": "2025-11-13T12:00:00Z"
  },
  "timestamp": "2025-11-13T12:00:00Z"
}
```

---

## Server → Client Events

### Event Types

#### Chat Events
- `message` - New message in room
- `message.edited` - Message edited
- `message.deleted` - Message deleted

#### Task Events
- `task.created` - New task created
- `task.updated` - Task updated
- `task.status_changed` - Task status changed
- `task.assigned` - Task assigned to user
- `task.deleted` - Task deleted

#### Project Events
- `project.updated` - Project details updated
- `project.archived` - Project archived

#### System Events
- `user_joined` - User joined room
- `user_left` - User left room
- `notification.new` - New notification for user
- `error` - Error message

### Event Envelope
```json
{
  "type": "event_type",
  "room": "room_identifier",
  "data": { ... },
  "sender": "username",
  "timestamp": "2025-11-13T12:00:00Z"
}
```

### Example: Task Created
```json
{
  "type": "task.created",
  "room": "project:123",
  "data": {
    "task_id": 789,
    "title": "New feature implementation",
    "status": "todo",
    "priority": "high",
    "assignee": "bob",
    "creator": "alice"
  },
  "sender": "alice",
  "timestamp": "2025-11-13T12:00:00Z"
}
```

### Example: Task Status Changed
```json
{
  "type": "task.status_changed",
  "room": "project:123",
  "data": {
    "task_id": 789,
    "old_status": "todo",
    "new_status": "in_progress",
    "changed_by": "bob"
  },
  "sender": "system",
  "timestamp": "2025-11-13T12:00:00Z"
}
```

### Example: Notification
```json
{
  "type": "notification.new",
  "data": {
    "title": "You were mentioned",
    "message": "Alice mentioned you in channel #general",
    "link": "/project/123/channel/456",
    "priority": "normal"
  },
  "timestamp": "2025-11-13T12:00:00Z"
}
```

---

## Room Identifiers

Format: `{entity_type}:{entity_id}`

### Supported Room Types

| Room Type | Format | Description |
|-----------|--------|-------------|
| Project | `project:123` | All updates related to project |
| Channel | `channel:456` | Chat messages in channel |
| Task | `task:789` | Updates to specific task |
| User | `user:12345` | Personal notifications (internal) |

### Room Access Control
- Users can only join rooms they have access to
- Server validates permissions before allowing join
- Unauthorized join attempts result in `4403 Forbidden`

---

## Error Codes

| Code | Reason | Description |
|------|--------|-------------|
| 4401 | Authentication Failed | Invalid or missing JWT token |
| 4403 | Forbidden | No access to requested room |
| 4429 | Too Many Connections | User exceeded max connections (5) |
| 4500 | Internal Server Error | Server-side error |

### Error Message Format
```json
{
  "type": "error",
  "data": {
    "error": "Error description"
  },
  "timestamp": "2025-11-13T12:00:00Z"
}
```

---

## Best Practices

### Client Implementation

#### 1. Automatic Reconnection
```javascript
let ws;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

function connect() {
  ws = new WebSocket(`ws://localhost:8000/api/v1/ws/connect?token=${token}`);
  
  ws.onclose = (event) => {
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      setTimeout(connect, delay);
    }
  };
  
  ws.onopen = () => {
    reconnectAttempts = 0;
  };
}
```

#### 2. Heartbeat (Keep-Alive)
```javascript
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "ping" }));
  }
}, 30000); // Every 30 seconds
```

#### 3. Message Queue for Offline
```javascript
const messageQueue = [];

function sendMessage(message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    messageQueue.push(message);
  }
}

ws.onopen = () => {
  while (messageQueue.length > 0) {
    ws.send(JSON.stringify(messageQueue.shift()));
  }
};
```

---

## Server Configuration

### Environment Variables
```env
REDIS_URL=redis://localhost:6379/0
MAX_CONNECTIONS_PER_USER=5
WS_HEARTBEAT_INTERVAL=30
```

### Scaling with Redis Pub/Sub
- Multiple FastAPI instances can share WebSocket connections
- Events published to Redis are broadcast to all instances
- Each instance maintains local connection state
- Horizontal scaling without sticky sessions

---

## Testing

### Manual Testing with wscat
```bash
# Install wscat
npm install -g wscat

# Connect
wscat -c "ws://localhost:8000/api/v1/ws/connect?token=YOUR_TOKEN"

# Send messages
> {"type": "join_room", "room": "channel:1"}
> {"type": "send_message", "room": "channel:1", "data": {"content": "Hello"}}
```

### Automated Testing (pytest)
See `backend/tests/test_websocket.py` for integration tests.

---

## Security Considerations

1. **JWT Validation**: All connections authenticated via JWT
2. **Rate Limiting**: Max 5 concurrent connections per user
3. **Room Access Control**: Permissions checked before joining rooms
4. **Message Sanitization**: All user input validated
5. **Logging**: All connections and security events logged
6. **CORS**: WebSocket upgrades respect CORS settings

---

## Performance Notes

- **Concurrency**: Uses asyncio for non-blocking I/O
- **Memory**: ~1KB per active connection
- **Latency**: <10ms for local broadcast, ~50ms with Redis
- **Throughput**: 10,000+ messages/second per instance
- **Scaling**: Linear horizontal scaling with Redis

---

## Troubleshooting

### Connection Refused
- Check JWT token is valid and not expired
- Verify WebSocket endpoint URL
- Check server logs for authentication errors

### Messages Not Received
- Ensure you've joined the room (`join_room`)
- Check room identifier format
- Verify user has access to room

### Disconnections
- Implement heartbeat/ping mechanism
- Check network stability
- Review server logs for errors

---

## Example: Complete Chat Client

```javascript
class ChatClient {
  constructor(token) {
    this.token = token;
    this.ws = null;
    this.handlers = {};
  }
  
  connect() {
    this.ws = new WebSocket(
      `ws://localhost:8000/api/v1/ws/connect?token=${this.token}`
    );
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const handler = this.handlers[message.type];
      if (handler) handler(message);
    };
  }
  
  on(eventType, handler) {
    this.handlers[eventType] = handler;
  }
  
  joinRoom(room) {
    this.send({ type: "join_room", room });
  }
  
  sendMessage(room, content) {
    this.send({
      type: "send_message",
      room,
      data: { content }
    });
  }
  
  send(message) {
    this.ws.send(JSON.stringify(message));
  }
}

// Usage
const client = new ChatClient("your_jwt_token");
client.connect();

client.on("connected", (msg) => {
  console.log("Connected as", msg.data.username);
  client.joinRoom("channel:1");
});

client.on("message", (msg) => {
  console.log(`${msg.data.username}: ${msg.data.content}`);
});

client.on("task.created", (msg) => {
  console.log("New task:", msg.data.title);
});
```

