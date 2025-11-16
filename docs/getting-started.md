[← Back to Index](./INDEX.md)

# Getting Started

Quick guide to spin up the project locally.

## Prerequisites
- Docker Desktop or Docker Engine + Compose v2+
- PowerShell (Windows) or Make (Linux/Mac)
- Python 3.12+ (for local dev without Docker)

## Quick Start (Docker)
```powershell
# Windows
./scripts/manage.ps1 setup
./scripts/manage.ps1 up

# Linux/Mac
make setup
make up
```

**Access:**
- Backend API: http://localhost:8000/docs
- n8n: http://localhost:5678
- Frontend (optional): http://localhost:3000

**Single entry via Nginx (optional):**
```powershell
docker-compose --profile full --profile nginx up -d
# Then open http://localhost/ (frontend) and http://localhost/api/v1 (backend)
```

## Environment Setup

### Required Variables
Create `.env` in project root (or `infra/docker/.env` for Docker):

**1. JWT_SECRET** (critical)
```powershell
# Generate random secret (PowerShell)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Add to .env
JWT_SECRET=<your_generated_secret>
```

**2. DATABASE_URL**
```env
DATABASE_URL=postgresql+psycopg2://postgres:<PASSWORD>@localhost:5432/project_manager
```

**3. REDIS_URL** (optional)
```env
REDIS_URL=redis://localhost:6379/0
# or with password
REDIS_URL=redis://:<PASSWORD>@localhost:6379/0
```

**4. N8N_URL** (optional, for webhooks)
```env
N8N_URL=http://localhost:5678
```

### Other Settings
```env
APP_ENV=development
LOG_LEVEL=info
BACKEND_PORT=8000
```

## Local Development (No Docker)
```powershell
# 1. Create virtual environment
python -m venv PMvenv
.\PMvenv\Scripts\Activate.ps1  # Windows
# source PMvenv/bin/activate    # Linux/Mac

# 2. Install dependencies
pip install -r requirements.txt

# 3. Setup database
alembic upgrade head

# 4. Run server
uvicorn backend.app.main:app --reload --port 8000
```

## Next Steps
- Apply migrations: `make db-migrate`
- Run tests: `make test`
- Import n8n workflows: see [workflows.md](./workflows.md)
- Explore API: http://localhost:8000/docs
