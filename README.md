# Project Manager Platform

Modern FastAPI-based backend scaffold for a real-time AI-powered project management platform.

## Structure
```
backend/
  app/
    api/        # Routers
    core/       # Settings, security, logging, dependencies
    db/         # SQLAlchemy base & session (migrations via alembic later)
    schemas/    # Pydantic models (request/response)
    services/   # Business logic layer
    main.py     # FastAPI application entrypoint
  tests/        # Pytest tests
frontend/       # Frontend client (placeholder)
infra/          # Infrastructure as code (placeholder)
workflows/      # Workflow / n8n automations (placeholder)
```

## Quick start
1. Create `.env` from `.env.example`.
2. Install deps:
```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
3. Run dev server:
```powershell
uvicorn backend.app.main:app --reload --port 8000
```

## Testing
```powershell
pytest -q
```

## Docker
```powershell
docker build -t project-manager-backend -f backend/Dockerfile .
docker run -p 8000:8000 --env-file .env project-manager-backend
```

## Next Steps
- Add Alembic migrations & models.
- Implement auth & user domain.
- Integrate Redis / Celery for background tasks.
- Add WebSocket endpoints for real-time updates.
- Introduce AI microservice integration.

