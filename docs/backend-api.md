[← Back to Index](./INDEX.md)

# Backend REST API

Base URL: `/api/v1`  
Auth: Bearer JWT header OR HttpOnly cookies (`access_token`, `refresh_token`)  
Format: `application/json`

## Authentication (`/auth`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Login (sets HttpOnly cookies + returns JSON tokens) |
| `/auth/refresh` | POST | Refresh access token (updates cookie) |
| `/auth/me` | GET | Current user info |

### Cookie Notes
Access & refresh tokens are also stored as HttpOnly cookies (production: Secure). Clients can still consume JSON fields for backward compatibility.

## Projects (`/projects`)
- `POST /` — Create project
- `GET /` — List projects; supports `include=metrics`
- `GET /{id}` — Project details
- `GET /{id}/metrics` — Project metrics (progress %, overdue, velocity)
- `PUT /{id}` — Update (owner/admin)
- `DELETE /{id}` — Archive (owner/admin)

### Project Metrics Fields
| Field | Description |
|-------|-------------|
| `total_tasks` | Total tasks in project |
| `completed_tasks` | Tasks with status `done` |
| `progress_percent` | Completion percentage |
| `overdue_tasks` | Tasks past due date not `done` |
| `velocity_7d` | Tasks completed in last 7 days |

## Tasks (`/tasks`)
- `POST /` — Create task
- `GET /` — List tasks (`project_id`, `assignee_id` filters)
- `GET /{id}` — Task details
- `PUT /{id}` — Update (creator/assignee/owner/admin)
- `DELETE /{id}` — Delete (owner/admin)

## Channels / Messages / Users
(As previously documented — unchanged)

## Health
`GET /health/` — Basic service health (DB, cache checks)

## Common Response Codes
Same as before: 200, 201, 204, 400, 401, 403, 404.

## Rate Limiting
Not implemented yet (planned enhancement).

## Related Docs
- [WebSockets](./websockets.md) — Real-time rooms & events
- [Implementation](./implementation.md)
- [Testing](./testing.md)
