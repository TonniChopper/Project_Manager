[← Back to Index](./INDEX.md)

# Implementation Summary (REST + DB)

This document consolidates the REST API and database implementation overviews.

## REST API (v1)
- Base: `/api/v1`
- Routers: projects, tasks, channels, messages, users
- Auth: Bearer JWT

Endpoints by resource (highlights):
- Projects: POST `/projects/`, GET `/projects/`, GET `/projects/{id}`, PUT, DELETE
- Tasks: POST `/tasks/`, GET `/tasks/?project_id=...`, GET `/tasks/{id}`, PUT, DELETE
- Channels: POST `/channels/`, GET `/channels/{id}`, GET `/channels/project/{pid}`, PUT, DELETE
- Messages: POST `/messages/`, GET `/messages/channel/{cid}`, GET `/messages/{id}`, PUT, DELETE
- Users: POST `/users/`, GET `/users/` (admin), GET/PUT/DELETE `/users/{id}`

Permissions:
- Projects: owner/admin for updates and archive
- Tasks: creator/assignee/project owner/admin for update; owner/admin for delete
- Messages: author/admin for edit/delete
- Users: self/admin for update/delete; listing is admin-only

OpenAPI:
- `summary`, `response_model`, `status_code`, `tags` for all
- Swagger at `/docs`

---

## Database (PostgreSQL/SQLAlchemy)

Models:
- User, Project, Task, Channel, Message, WebhookEvent
- Enums for Task.status, Task.priority, Project.status
- Timestamp mixin with `created_at`, `updated_at`
- Relationships with `back_populates`, cascade rules

Session & Engine:
- `SessionLocal` with pooling, pre-ping, recycle
- `get_db()` dependency for FastAPI

Migrations:
- Alembic initialized; autogenerate supported
- `webhook_events` table added for audit logging

Schemas (Pydantic):
- Request: `*Create`, `*Update`
- Response: `*Public`, `*Detail`
- ORM mode enabled

Repositories:
- `UserRepository` (get/create/update/delete/list)

---

## Testing
- `backend/tests/` suites for models, auth, health, websocket, webhooks
- SQLite used in tests (fast), Alembic path for Postgres

## Known Technical Items
- Some raw SQL for user lookups; can be migrated to repository usage
- Pagination/limits defaulted; can be refined
- Channels permissions simplified to admin for updates/deletes

---

## Commands
```powershell
# Run server
ython -m uvicorn backend.app.main:app --reload --port 8000

# Migrations
alembic revision --autogenerate -m "change"
alembic upgrade head
alembic downgrade -1

# Tests
pytest -q
```

Last Updated: 2025-11-14

