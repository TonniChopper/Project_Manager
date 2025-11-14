[← Back to Index](./INDEX.md)

# Backend REST API

Base URL: `/api/v1`  
Auth: Bearer JWT token in `Authorization` header  
Format: `application/json`

## Authentication (`/auth`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Login, returns access + refresh tokens |
| `/auth/refresh` | POST | Refresh access token |
| `/auth/me` | GET | Get current user info (protected) |

**Example Login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"Secret123"}'
```

Response: `{"access_token":"...","refresh_token":"...","token_type":"bearer"}`

## Resources

All resource endpoints support standard CRUD operations.

### Projects (`/projects`)
- `POST /` - Create project
- `GET /` - List projects
- `GET /{id}` - Get project details
- `PUT /{id}` - Update project (owner/admin)
- `DELETE /{id}` - Archive project (owner/admin)

### Tasks (`/tasks`)
- `POST /` - Create task
- `GET /` - List tasks (filterable by `project_id`, `assignee_id`)
- `GET /{id}` - Get task details
- `PUT /{id}` - Update task (creator/assignee/owner/admin)
- `DELETE /{id}` - Delete task (owner/admin)

### Channels (`/channels`)
- `POST /` - Create channel
- `GET /project/{project_id}` - List project channels
- `GET /{id}` - Get channel details
- `PUT /{id}` - Update channel (admin)
- `DELETE /{id}` - Delete channel (admin)

### Messages (`/messages`)
- `POST /` - Create message
- `GET /channel/{channel_id}` - List channel messages (paginated)
- `GET /{id}` - Get message details
- `PUT /{id}` - Edit message (author/admin)
- `DELETE /{id}` - Delete message (author/admin)

### Users (`/users`)
- `POST /` - Create user (public registration)
- `GET /` - List users (admin only)
- `GET /{id}` - Get user profile
- `PUT /{id}` - Update user (self/admin)
- `DELETE /{id}` - Delete user (self/admin)

## Health Check
`GET /health/` - Service health status

Response includes database and Redis connectivity status.

## API Documentation
Interactive docs available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Common Response Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success (no body)
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found

## Rate Limiting
Not currently implemented (future enhancement).

## Related Docs
- [WebSockets](./websockets.md) - Real-time API
- [Webhooks](./workflows.md) - Outbound notifications
- [Implementation](./implementation.md) - Technical details

