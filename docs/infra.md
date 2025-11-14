[← Back to Index](./INDEX.md)

# Infrastructure & Deployment

## Local Development

### Docker Compose
```powershell
cd infra/docker
docker-compose up -d
```

Services:
- **PostgreSQL 15** (port 5432)
- **Redis 7** (port 6379)
- **FastAPI Backend** (port 8000)
- **n8n** (port 5678)
- **Frontend** (port 3000, optional)

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
```

### Profiles

**Default:** Core services only
```powershell
docker-compose up -d
```

**Full:** With frontend
```powershell
docker-compose --profile full up -d
```

**Tools:** With PgAdmin & Redis Commander
```powershell
docker-compose --profile tools up -d
```

## Health Checks

All services include health checks and auto-restart.

```bash
# Check service status
docker-compose ps

# View specific logs
docker-compose logs -f app
```

## Production Deployment

### Docker
```bash
BUILD_TARGET=production docker-compose up -d
```

### Kubernetes
K8s manifests planned in `infra/kubernetes/`

### Terraform
IaC provisioning planned in `infra/terraform/`

## Monitoring

Health endpoint: `GET /api/v1/health/`

Response includes:
- Service status
- Database connectivity
- Redis connectivity
- Response times

## Backups

```powershell
# Database backup
./scripts/manage.ps1 db-backup

# Restore
./scripts/manage.ps1 db-restore
```

## Scaling

### Horizontal Scaling
- WebSocket: Redis pub/sub enables multi-instance
- API: Stateless, can run multiple replicas
- Database: Single primary (replication can be added)

### Vertical Scaling
Adjust resources in `docker-compose.yml`:
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

## Related Docs
- [Docker Setup](./docker.md) - Development environment
- [Getting Started](./getting-started.md) - Initial setup
- Full infra guide: `infra/README.md`

