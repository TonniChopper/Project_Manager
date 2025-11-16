[← Back to Index](./INDEX.md)

# Project Structure

High-level overview of the project organization.

## Root Structure
```
Project_Manager/
├── backend/          # FastAPI application
├── frontend/         # React application (present)
├── workflows/        # n8n automations
├── infra/            # Docker, Nginx, etc.
├── docs/             # Documentation
├── scripts/          # Helper scripts
└── PMvenv/           # Python virtual environment
```

## Backend (`backend/`)
```
backend/
├── app/
│   ├── api/          # REST & WebSocket endpoints
│   ├── core/         # Settings, security, logging
│   ├── db/           # Models, session, repositories
│   ├── schemas/      # Pydantic request/response models
│   ├── services/     # Business logic
│   └── main.py       # FastAPI app entrypoint
├── tests/            # Pytest test suites
└── alembic/          # Database migrations
```

## Frontend (`frontend/`)
- React 18 app with styled-components theme, framer-motion, axios services, DnD Kanban
- Single primary README retained; other docs consolidated to `docs/`

## Workflows (`workflows/`)
- n8n workflow exports (JSON)

## Infra (`infra/`)
- `docker/` - Compose files, Nginx config

## Docs (`docs/`)
- All project documentation organized by topic.

## Configuration Files
- `.env` - Backend environment variables (root)
- `infra/docker/.env` - Compose overrides
- `requirements.txt` - Python dependencies
- `alembic.ini` - Migration config
- `ruff.toml` - Linter config
- `Makefile` / `scripts/manage.ps1` - Command shortcuts

Last Updated: 2025-11-16
