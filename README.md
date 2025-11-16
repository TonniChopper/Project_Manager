# Project Manager — FastAPI + React

AI‑powered project management platform with real‑time chat, Kanban tasks, project metrics, and a beautiful modern UI.

## Monorepo Layout
- `backend/` — FastAPI API (JWT HttpOnly cookies, PostgreSQL, Redis, Alembic, WebSockets)
- `frontend/` — React UI (styled-components, framer-motion, drag & drop, axios)
- `infra/` — Docker Compose, Nginx reverse proxy (single entry on :80)
- `docs/` — internal technical docs (API, websockets, infra, workflows)

## Feature Highlights
- Project metrics (progress %, velocity 7d, overdue tasks)
- Auth with access & refresh tokens (JSON + HttpOnly cookies)
- Scalable WebSocket layer (rooms: project/channel/task, Redis pub/sub)
- Kanban task board & rich animated UI components
- Workflow & webhook integration (n8n)
- CI (GitHub Actions: lint/test/build + multi-arch Docker images)

## Quick Start (Local)
### Backend
```bash
cd backend
..\PMvenv\Scripts\activate
pip install -r ..\requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```
### Frontend
```bash
cd frontend
npm install
# Optional .env.local overrides:
# REACT_APP_API_URL=http://localhost:8000/api/v1
# REACT_APP_WS_URL=ws://localhost:8000/api/v1/ws
npm start
```
Open:
- UI: http://localhost:3000
- API: http://localhost:8000 (Swagger /docs)
- WS: ws://localhost:8000/api/v1/ws/connect?token=ACCESS_TOKEN

## Project Metrics API
- `GET /api/v1/projects?include=metrics` — list projects enriched with metrics
- `GET /api/v1/projects/{id}/metrics` — single project metrics

Metric fields:
| Field | Meaning |
|-------|---------|
| `total_tasks` | Total tasks in project |
| `completed_tasks` | Number of tasks with status `done` |
| `progress_percent` | (completed / total)*100 rounded |
| `overdue_tasks` | Tasks past due date & not done |
| `velocity_7d` | Tasks completed in last 7 days |

## Auth Flow (Cookies + JSON)
Login / refresh responses still return JSON tokens for backward compatibility while also setting:
```
Set-Cookie: access_token=...; HttpOnly; SameSite=Lax
Set-Cookie: refresh_token=...; HttpOnly; SameSite=Lax
```
In production (`APP_ENV=production`) cookies are `Secure`.
Frontend should prefer cookie transport (remove localStorage secrets in prod). Tests continue to use Bearer headers.

## WebSockets
Endpoint: `ws://localhost:8000/api/v1/ws/connect?token=ACCESS_TOKEN`
Rooms validate prefix: `channel:{id}` | `project:{id}` | `task:{id}`.
Events: `message`, `user_joined`, `user_left`, `task.*`, `project.*`, `notification.*`.
See `docs/websockets.md`.

## Docker & Nginx
Single entry point `localhost:80` with reverse proxy:
- `/` → React dev server / frontend container
- `/api/` → FastAPI backend
- `/api/v1/ws/` → WebSocket upgrade
- `/n8n/` → n8n automation

## Environment Variables
Root `.env.example` holds backend settings:
- `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `CORS_ORIGINS`, `APP_ENV`
Frontend: `.env.local` for `REACT_APP_API_URL`, `REACT_APP_WS_URL`.
Infra: `infra/docker/.env.example` for compose port overrides.

## Makefile Shortcuts
```bash
make up          # start core services (db+redis+backend)
make up-full     # start all (incl. frontend, n8n, nginx)
make down        # stop
make status      # container status
make logs        # aggregated logs
make test        # backend tests
make lint        # ruff + eslint (if scripted)
```

## Documentation Index
See `docs/INDEX.md` for full map:
- API: `docs/backend-api.md`
- Frontend Guide: `docs/frontend.md`
- WebSockets: `docs/websockets.md`
- Infra & Docker: `docs/infra.md` / `docs/docker.md`
- Migrations: `docs/migrations.md`
- Testing: `docs/testing.md`
- Workflows (n8n): `docs/workflows.md`
- Structure: `docs/structure.md`

## Production Notes
- Serve frontend build behind Nginx (ensure proper cache headers)
- Enforce HTTPS → Secure cookies & `SameSite=Lax` or `None` as needed
- Rotate `JWT_SECRET`, set strong values
- Scale WebSocket horizontally with Redis enabled
- Schedule periodic metrics recomputation if moving to pre-aggregated model

---
© 2025 Project Manager. FastAPI + React.
