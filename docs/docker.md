[← Back to Index](./INDEX.md)

# Docker & Local Development

Quick links:
- Infrastructure guide: `./infra.md`
- Compose files: `infra/docker/`

## Quick Start
```powershell
copy infra\docker\.env.example infra\docker\.env
./scripts/manage.ps1 up
```

## Common Commands
```powershell
./scripts/manage.ps1 build
./scripts/manage.ps1 up
./scripts/manage.ps1 down
./scripts/manage.ps1 db-migrate
./scripts/manage.ps1 logs
```

## Profiles
- default: app + db + redis + n8n
- full: + frontend
- tools: + pgadmin + redis-commander
- nginx: + nginx reverse proxy (single entry :80)

Start full stack with nginx:
```powershell
docker-compose --profile full --profile nginx up -d
```

Last Updated: 2025-11-16
