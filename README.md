# Project Manager — FastAPI + React

AI‑powered project management platform with real‑time chat, Kanban tasks, and a beautiful modern UI.

## Monorepo Layout

- `backend/` — FastAPI API (JWT auth, PostgreSQL, Redis, Alembic, WebSockets)
- `frontend/` — React UI (styled‑components, framer‑motion, @dnd‑kit, axios)
- `infra/` — Docker Compose, Nginx, DB bootstrap
- `docs/` — internal documentation (API, websockets, infra, workflows)

## Quick Start (Local)

Backend (requires Python 3.12+, PostgreSQL, Redis):

```bash
cd backend
..\PMvenv\Scripts\activate
pip install -r ..\requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Frontend (Node 18+):

```bash
cd frontend
npm install
# Configure API/WS (optional overrides): create .env.local
# REACT_APP_API_URL=http://localhost:8000/api/v1
# REACT_APP_WS_URL=ws://localhost:8000/api/v1/ws
npm start
```

Open:
- UI: http://localhost:3000
- API: http://localhost:8000
- Docs (OpenAPI): http://localhost:8000/docs

## Quick Start (Docker Compose)

All core services (DB, Redis, Backend, n8n, Frontend):

```bash
# In project root
make setup            # creates infra/docker/.env from example if missing
make up-full          # start db + cache + backend + frontend
make status           # show ports and health
```

or via docker-compose directly:

```bash
cd infra/docker
cp .env.example .env   # adjust variables if needed
docker-compose --profile full up -d --build
```

Services:
- Frontend: http://localhost:${FRONTEND_PORT:-3000}
- Backend: http://localhost:${BACKEND_PORT:-8000}
- n8n: http://localhost:${N8N_PORT:-5678}
- PgAdmin (tools profile): http://localhost:${PGADMIN_PORT:-5050}
- Redis Commander (tools profile): http://localhost:${REDIS_COMMANDER_PORT:-8081}

Note: Frontend in Docker is pre‑wired with `REACT_APP_API_URL=http://localhost:8000/api/v1` and `REACT_APP_WS_URL=ws://localhost:8000/api/v1/ws`.

## Backend (API)

- Tech: FastAPI, SQLAlchemy, Alembic, JWT, Redis, WebSockets
- Entry: `backend/app/main.py`, router: `backend/app/api/`
- Settings: `backend/app/core/settings.py` (.env in project root)
- Migrations: `alembic` (see `docs/migrations.md`)

Common commands:
```bash
# From backend/
uvicorn app.main:app --reload --port 8000
alembic revision --autogenerate -m "message" && alembic upgrade head
pytest -q
```

## Frontend (UI)

- Tech: React 18, styled‑components 6, framer‑motion, @dnd‑kit, axios
- Entry: `frontend/src/App.js`, theme: `frontend/src/theme/`
- API client: `frontend/src/services/api.js`

Common commands:
```bash
# From frontend/
npm install
npm start
npm run build
npm run lint
npm run format
```

## Infra (Docker)

Compose file: `infra/docker/docker-compose.yml` with services:
- `db` (Postgres 15)
- `cache` (Redis 7)
- `app` (FastAPI backend, hot‑reload)
- `frontend` (CRA dev server)
- `n8n` (automation)
- optional: `pgadmin`, `redis-commander`, `nginx`

One‑liner to launch all core services:
```bash
make up-full     # or: docker-compose --profile full up -d --build -f infra/docker/docker-compose.yml
```

## Docs

See `docs/` for details:
- API: `docs/backend-api.md`
- WebSockets: `docs/websockets.md`
- Infra & Docker: `docs/infra.md`, `docs/docker.md`
- Migrations: `docs/migrations.md`
- Frontend: `docs/frontend.md`
- Testing: `docs/testing.md`
- Workflows (n8n): `docs/workflows.md`

## Environment

Root `.env.example` exists. Important keys:
- Backend: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `CORS_ORIGINS`
- Frontend: `REACT_APP_API_URL`, `REACT_APP_WS_URL`
- Compose vars in `infra/docker/.env.example`

## Makefile Shortcuts

Useful targets in `Makefile`:
- `make up` / `make up-full` / `make down`
- `make status` / `make logs` / `make restart-app`
- `make db-migrate` / `make db-backup` / `make db-restore`
- `make test` / `make lint` / `make format`

## Housekeeping

- Kept only core folders at root: `backend/`, `frontend/`, `infra/`, `docs/`
- Cleaned demo placeholders in frontend (pages/components) and wired real API/WebSocket
- Compose adjusted to `./backend` and `./frontend` contexts, with correct API/WS URLs

---

© 2025 Project Manager. Built with FastAPI + React.
