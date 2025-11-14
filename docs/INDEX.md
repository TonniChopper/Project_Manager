# Documentation Index

Complete guide to Project Manager Platform documentation.

## Getting Started
- [Quick Setup](./getting-started.md) - Environment setup, installation, first run

## API & Integration
- [Backend API](./backend-api.md) - REST endpoints, authentication, CRUD operations
- [WebSockets](./websockets.md) - Real-time messaging, rooms, events
- [Webhooks & n8n](./workflows.md) - Automation, n8n integration, event payloads

## Database & Storage
- [Implementation Guide](./implementation.md) - Models, schemas, repositories (REST + DB)
- [Migrations](./migrations.md) - Alembic workflow, commands, best practices

## Infrastructure
- [Docker Setup](./docker.md) - Local development environment
- [Infrastructure Guide](./infra.md) - Deployment, scaling, configuration

## Development
- [Testing](./testing.md) - Test suites, coverage, CI/CD
- [Project Structure](./structure.md) - Folder organization, architecture

---

## Quick Commands

```powershell
# Setup
./scripts/manage.ps1 setup && ./scripts/manage.ps1 up  # Windows
make setup && make up                                   # Linux/Mac

# Development
alembic upgrade head      # Apply migrations
pytest -q                 # Run tests
uvicorn backend.app.main:app --reload  # Start server

# Docker
./scripts/manage.ps1 logs      # View logs
./scripts/manage.ps1 db-shell  # Database shell
```

---

*Last updated: 2025-11-14*

