[← Back to Index](../docs/INDEX.md)

# Infrastructure as Code (IaC)

## Purpose

This directory contains infrastructure configuration for deploying Project Manager across environments, with full local development and CI/CD support.

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2+
- Make (optional, Linux/Mac)
- PowerShell 5.1+ (Windows)

### One-Command Setup
```powershell
# Windows
./scripts/manage.ps1 setup
./scripts/manage.ps1 up

# Linux/Mac
make setup
make up
```

Open:
- Backend API: http://localhost:8000/docs
- n8n: http://localhost:5678
- Frontend: http://localhost:3000 (if enabled)

---

## 📁 Contents

### docker/
Docker and Docker Compose configuration for local development

Files:
- docker-compose.yml – Orchestration for all services
- .env.example – Environment variable template
- postgres/init.sql – PostgreSQL initialization
- nginx/nginx.conf – Reverse proxy configuration

Services:
- db (PostgreSQL 15)
- cache (Redis 7)
- app (FastAPI backend)
- n8n (automation)
- frontend (React) [profile: full]
- pgadmin [profile: tools]
- redis-commander [profile: tools]
- nginx [profile: nginx]

---

## 🔧 Configuration

Create `.env` from template:
```powershell
copy infra\docker\.env.example infra\docker\.env
```

Key variables:
```env
JWT_SECRET=<generate-secure-random-string>
POSTGRES_PASSWORD=<strong-password>
REDIS_PASSWORD=<strong-password>
APP_ENV=development
LOG_LEVEL=info
BACKEND_PORT=8000
FRONTEND_PORT=3000
POSTGRES_PORT=5432
```

Generate a secret:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

---

## 🐳 Commands

Using Makefile (Linux/Mac/WSL):
```bash
make setup && make up          # Start
make db-migrate                # Migrations
make test                      # Tests
make logs                      # Logs
make down                      # Stop
```

Using PowerShell (Windows):
```powershell
./scripts/manage.ps1 setup
./scripts/manage.ps1 up
./scripts/manage.ps1 db-migrate
./scripts/manage.ps1 logs
./scripts/manage.ps1 down
```

Using Docker Compose directly:
```bash
cd infra/docker

docker-compose up -d
# with profiles
docker-compose --profile full up -d

docker-compose logs -f app

docker-compose down
```

---

## 🏗️ Backend Dockerfile (multi-stage)

Targets:
- development: hot-reload, dev tools
- production: optimized, gunicorn workers
- testing: pytest with coverage

Build args: PYTHON_VERSION, BUILD_DATE, VCS_REF

---

## 🔍 Health Checks

All services include health checks and auto-restart. Endpoints:
- Backend: GET /api/v1/health/
- n8n: GET /healthz
- PostgreSQL: pg_isready
- Redis: PING

---

## 📊 Logs & Monitoring

Use `docker-compose logs -f` or the helper scripts. Log rotation is enabled (10MB x3).

---

## 🔐 Secrets

Development: `.env` (never commit)
Production: Docker Secrets / Cloud secret manager / Kubernetes Secrets

---

## 🧪 Testing

Run tests in Docker or locally via `make test` / `./scripts/manage.ps1 test`.

---

## 🔄 CI/CD

Examples provided in repository (GitHub Actions/GitLab CI). Adapt to your pipeline.

---

## 🚀 Deployment

- Development: `make up` or `./scripts/manage.ps1 up`
- Production: use `BUILD_TARGET=production`, configure secrets, and deploy behind a reverse proxy (optional nginx profile provided)

---

## 🆘 Troubleshooting

- Check logs: `docker-compose logs`
- Rebuild without cache: `docker-compose build --no-cache`
- Clean Docker resources: `make clean`

---

## 📚 More Docs

- Docker Compose: https://docs.docker.com/compose/
- Multi-stage builds: https://docs.docker.com/build/building/multi-stage/
- Health checks: https://docs.docker.com/engine/reference/builder/#healthcheck

Last Updated: 2025-11-14 | Version: 2.1
