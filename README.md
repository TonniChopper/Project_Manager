# Project Manager Platform

Modern FastAPI-based backend scaffold for a real-time AI-powered project management platform.

## Features
- 🔐 **JWT Authentication** with access/refresh tokens
- 💬 **Real-time WebSocket** with Redis pub/sub for horizontal scaling
- 🗄️ **PostgreSQL + SQLAlchemy** with Alembic migrations
- 📊 **Comprehensive Models**: User, Project, Task, Channel, Message
- 🧪 **Test Coverage**: Auth, WebSocket, Models, Migrations
- 📚 **Complete API Documentation**
- 🚀 **Production Ready**: Docker, logging, error handling

## Structure
```
backend/
  app/
    api/          # REST & WebSocket routers (auth, health, ws)
    core/         # Settings, security, logging, dependencies
    db/           # SQLAlchemy models, session, migrations (Alembic)
    schemas/      # Pydantic models (request/response)
    services/     # Business logic layer (auth, websocket, events)
    main.py       # FastAPI application entrypoint
  tests/          # Pytest tests (models, auth, websocket, migrations)
frontend/         # Frontend client (placeholder)
infra/            # Infrastructure as code (placeholder)
workflows/        # Workflow / n8n automations (placeholder)
WEBSOCKET_API.md  # WebSocket API documentation
ws_test_client.py # WebSocket test client
```

## Database Models
- **User**: username, email, hashed_password, role, full_name, avatar_url
- **Project**: name, description, owner, status, start/end dates
- **Task**: title, description, project, assignee, creator, status, priority, due_date
- **Channel**: name, description, project, is_private (for real-time chat)
- **Message**: content, channel, author, parent (threading support)

All models include `created_at` and `updated_at` timestamps.

## Quick start
1. Create `.env` from `.env.example`.
2. Install deps:
```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
3. Initialize database:
```powershell
# Option 1: Run migrations (recommended)
alembic upgrade head

# Option 2: Direct init (for development)
python -m backend.app.db.init_db
```
4. Run dev server:
```powershell
uvicorn backend.app.main:app --reload --port 8000
```

## WebSocket Real-time API
**Endpoint**: `ws://localhost:8000/api/v1/ws/connect?token=JWT_TOKEN`

**Features**:
- Room-based messaging (projects, channels, tasks)
- Event broadcasting (task updates, messages, notifications)
- Redis pub/sub for multi-instance support
- Per-user connection limits
- JWT authentication

**Quick Test**:
```powershell
python ws_test_client.py alice Secret123 interactive
```

See [WEBSOCKET_API.md](WEBSOCKET_API.md) for complete documentation.

## Database Migrations
```powershell
# Create new migration after model changes
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

## Testing
```powershell
# All tests
pytest -q

# Specific test suite
pytest backend/tests/test_models.py -v
pytest backend/tests/test_auth.py -v
pytest backend/tests/test_ws.py -v
```

## Docker
```powershell
docker build -t project-manager-backend -f backend/Dockerfile .
docker run -p 8000:8000 --env-file .env project-manager-backend
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT tokens
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user (protected)

### Health
- `GET /api/v1/health/` - Health check

### WebSocket
- `WS /api/v1/ws/connect?token=JWT` - Real-time communication

## Configuration

Key environment variables in `.env`:
```env
DATABASE_URL=postgresql+psycopg2://user:pass@localhost:5432/project_manager
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=your_secret_key
WS_MAX_CONNECTIONS_PER_USER=5
```

See `.env.example` for all options.

## Documentation
- [WEBSOCKET_API.md](WEBSOCKET_API.md) - WebSocket API documentation
- [WEBSOCKET_IMPLEMENTATION.md](WEBSOCKET_IMPLEMENTATION.md) - Implementation details
- [IMPLEMENTATION_SUMMARY_DB.md](IMPLEMENTATION_SUMMARY_DB.md) - Database layer details
- [backend/app/db/README.md](backend/app/db/README.md) - Database usage guide

## Architecture

### Layered Design
```
API Layer (FastAPI routers)
    ↓
Service Layer (Business logic)
    ↓
Repository Layer (DB queries)
    ↓
Model Layer (SQLAlchemy ORM)
```

### Real-time Events
```
Service Layer
    ↓
WebSocket Events (ws_events.py)
    ↓
ConnectionManager (ws_service.py)
    ↓
Redis Pub/Sub → All Instances → Clients
```

[//]: # (## Next Steps)

[//]: # (- ✅ JWT Authentication)

[//]: # (- ✅ WebSocket real-time layer)

[//]: # (- ✅ Database models & migrations)

[//]: # (- ✅ Comprehensive testing)

[//]: # (- 🔄 REST API for CRUD operations &#40;Projects, Tasks, Channels&#41;)

[//]: # (- 🔄 Room access control & permissions)

[//]: # (- 🔄 File uploads & storage)

[//]: # (- 🔄 Email notifications)

[//]: # (- 🔄 AI microservice integration)

[//]: # (- 🔄 Full-text search)

[//]: # (- 🔄 Background jobs &#40;Celery&#41;)



