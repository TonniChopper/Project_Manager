[← Back to Index](./INDEX.md)

# Infrastructure & Deployment

## Local Development

### Docker Compose
```powershell
cd infra/docker
docker-compose up -d
```

Services:
- PostgreSQL 15 (port 5432)
- Redis 7 (port 6379)
- FastAPI Backend (port 8000)
- n8n (port 5678)
- Frontend (port 3000, via profile `full`)
- Nginx reverse proxy (port 80, via profile `nginx`)

### Profiles
- default: core services (db, cache, app, n8n)
- full: + frontend
- tools: + pgadmin + redis-commander
- nginx: + nginx reverse proxy (single entry on :80)

Run with profiles:
```powershell
# Full stack with nginx
docker-compose --profile full --profile nginx up -d
```

### Management Scripts

**Windows (PowerShell):**
```powershell
./scripts/manage.ps1 up        # Start all services
./scripts/manage.ps1 down      # Stop services
./scripts/manage.ps1 logs      # View logs
./scripts/manage.ps1 db-shell  # Database shell
```

**Linux/Mac (Makefile):**
```bash
make up
make down
make logs
make db-shell
```

## Configuration

### Environment Variables
Create `infra/docker/.env` from `.env.example`:
```env
DATABASE_URL=postgresql+psycopg2://postgres:password@db:5432/project_manager
REDIS_URL=redis://cache:6379/0
JWT_SECRET=<64-char-random>
N8N_URL=http://n8n:5678
APP_ENV=development
```

## Health Checks
All services include health checks and auto-restart.

```powershell
docker-compose ps
docker-compose logs -f app
```

## Production Deployment

Docker (production target):
```bash
BUILD_TARGET=production docker-compose up -d
```

Notes:
- Serve via Nginx reverse proxy; single entry at :80
- Use HTTPS/TLS in production; set Secure cookies

Last Updated: 2025-11-16
