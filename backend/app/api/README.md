API v1 README

Base URL: {API_V1_PREFIX} (configured in settings, default: /api/v1)

Authentication
- Uses Bearer JWT tokens. Obtain tokens via /api/v1/auth/login.
- Protected endpoints require Authorization: Bearer <token> header.

Resources

Projects
- POST /api/v1/projects/ -> create project (auth required)
  Request: {"name": "Website Redesign", "description": "..."}
  Response (201): {"id": 1, "name": "Website Redesign", "description": "...", "owner_id": 2, "is_archived": false, "created_at": "...", "updated_at": "..."}

- GET /api/v1/projects/ -> list projects (public)
- GET /api/v1/projects/{id} -> get project detail
- PUT /api/v1/projects/{id} -> update project (owner/admin)
- DELETE /api/v1/projects/{id} -> archive project (owner/admin)

Tasks
- POST /api/v1/tasks/ -> create task (auth, project_id required)
  Request: {"title":"Design mockups","project_id":1}

Channels
- POST /api/v1/channels/ -> create channel in project (auth)
  Request: {"name":"general","project_id":1, "is_private": false}

Messages
- POST /api/v1/messages/ -> create message in channel (auth)
  Request: {"channel_id":10, "content":"Hello team"}
- GET /api/v1/messages/channel/{channel_id} -> list messages for a channel

Users
- POST /api/v1/users/ -> register user
  Request: {"username":"alice","password":"pw","email":"alice@test"}
- GET /api/v1/users/ -> list users (admin only)
- GET/PUT/DELETE /api/v1/users/{id} -> user profile management

Errors
- 401 Unauthorized: missing or invalid token
- 403 Forbidden: insufficient permissions
- 404 Not found: resource missing
- 422 Validation error: missing required fields

Testing
- Run pytest from project root: pytest -q backend/tests

