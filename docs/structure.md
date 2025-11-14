[← Back to Index](./INDEX.md)

# Project Structure

High-level overview of the project organization.

## Root Structure
```
Project_Manager/
├── backend/          # FastAPI application
├── frontend/         # React app (planned)
├── workflows/        # n8n automations
├── infra/            # Docker, K8s, Terraform
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

## Key Directories

### `workflows/`
- n8n workflow exports (JSON)
- Automation scripts
- Test payloads for webhooks

### `infra/`
- `docker/` - Compose files, Dockerfiles
- `kubernetes/` - K8s manifests (planned)
- `terraform/` - IaC provisioning (planned)

### `docs/`
All project documentation organized by topic.

## Configuration Files
- `.env` - Environment variables
- `requirements.txt` - Python dependencies
- `alembic.ini` - Migration config
- `ruff.toml` - Linter config
- `Makefile` - Command shortcuts (Linux/Mac)
- `scripts/manage.ps1` - Command shortcuts (Windows)

