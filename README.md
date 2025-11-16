# Project Manager Platform

Modern full-stack AI-powered project management platform with FastAPI backend, React frontend, real-time features, PostgreSQL, Redis, and n8n automation.

## 🎯 Features
- 🔐 **JWT Authentication** (access + refresh tokens)
- 💬 **Real-time WebSocket** (Redis pub/sub scaling)
- 🗄️ **PostgreSQL** + SQLAlchemy + Alembic migrations
- ⚛️ **React Frontend** with React Router v6
- 📊 **REST API** (Projects, Tasks, Channels, Messages, Users)
- 🔔 **Webhook integration** (n8n automation)
- 🧪 **Comprehensive test coverage**
- 🐳 **Docker development environment**
- 🎨 **Modern UI** with responsive design

## 🚀 Quick Start

### Docker (Recommended)
```powershell
# Windows
./scripts/manage.ps1 setup
./scripts/manage.ps1 up

# Linux/Mac
make setup && make up
```

### Local Development

#### Backend
```powershell
python -m venv PMvenv
.\PMvenv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
uvicorn backend.app.main:app --reload
```

#### Frontend
```powershell
cd frontend
npm install
npm start
```

**Access:**
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs
- Health: http://localhost:8000/api/v1/health/
- n8n: http://localhost:5678

## 📁 Project Structure

```
Project_Manager/
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── api/         # REST & WebSocket endpoints
│   │   ├── core/        # Settings, security, dependencies
│   │   ├── db/          # Models, repositories, migrations
│   │   ├── schemas/     # Pydantic models
│   │   └── services/    # Business logic
│   └── tests/           # Backend tests
├── frontend/            # React application
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── services/    # API & WebSocket services
│       └── styles/      # Global styles
├── infra/              # Infrastructure configs
├── workflows/          # n8n workflows
├── docs/              # Documentation
└── scripts/           # Management scripts
```

## Documentation

Comprehensive docs in `docs/`:

- **[Getting Started](docs/getting-started.md)** - Setup & environment configuration
- **[Backend API](docs/backend-api.md)** - REST endpoints overview
- **[WebSockets](docs/websockets.md)** - Real-time API & implementation
- **[Webhooks & n8n](docs/workflows.md)** - Automation integration
- **[Database](docs/implementation.md)** - Models, schemas, repositories
- **[Migrations](docs/migrations.md)** - Alembic workflow
- **[Docker & Infra](docs/docker.md)** - Local dev environment
- **[Testing](docs/testing.md)** - Test suites & coverage
- **[Project Structure](docs/structure.md)** - Folder organization

## 🔧 Key Technologies

### Backend
- **Framework:** FastAPI
- **ORM:** SQLAlchemy
- **Migrations:** Alembic
- **Validation:** Pydantic
- **Authentication:** JWT (PyJWT)
- **Testing:** Pytest

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **WebSocket:** Native WebSocket API
- **Code Quality:** ESLint, Prettier

### Infrastructure
- **Database:** PostgreSQL
- **Cache:** Redis
- **Real-time:** WebSockets, Redis pub/sub
- **Automation:** n8n
- **Containerization:** Docker, Docker Compose

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login (JWT tokens)
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Current user

### Resources (CRUD)
- `/api/v1/projects/` - Projects
- `/api/v1/tasks/` - Tasks
- `/api/v1/channels/` - Channels
- `/api/v1/messages/` - Messages
- `/api/v1/users/` - Users

### Real-time
- `WS /api/v1/ws/connect?token=JWT` - WebSocket

## Database Models
- **User** - username, email, role, full_name
- **Project** - name, owner, status, dates
- **Task** - title, project, assignee, status, priority
- **Channel** - name, project, is_private
- **Message** - content, channel, author, threading

All models include `created_at` and `updated_at` timestamps.

## Development Commands

```powershell
# Database
alembic revision --autogenerate -m "description"
alembic upgrade head
alembic downgrade -1

# Testing
pytest -q
pytest backend/tests/test_auth.py -v
pytest --cov=backend/app

# Docker
./scripts/manage.ps1 up        # Start services
./scripts/manage.ps1 logs      # View logs
./scripts/manage.ps1 down      # Stop services
```

## Environment Variables

Key variables in `.env`:
```env
DATABASE_URL=postgresql+psycopg2://user:pass@localhost:5432/project_manager
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=<64-random-chars>
N8N_URL=http://localhost:5678
```

See [Getting Started](docs/getting-started.md) for full configuration.

## Architecture

```
Client → FastAPI → Service Layer → Repository → PostgreSQL
              ↓
         WebSocket → Redis Pub/Sub → Broadcast
              ↓
         Webhooks → n8n → External Services
```

## Contributing
1. Fork the repository
2. Create feature branch
3. Run tests: `pytest`
4. Submit pull request

---

**Version:** 1.0  
**Last Updated:** 2025-11-14

