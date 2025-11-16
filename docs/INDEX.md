# Documentation Index

| Topic | File |
|-------|------|
| Getting Started | getting-started.md |
| Backend API | backend-api.md |
| Frontend Overview | frontend.md |
| WebSockets | websockets.md |
| Migrations | migrations.md |
| Structure | structure.md |
| Infra / Deployment | infra.md |
| Docker | docker.md |
| Testing | testing.md |
| Workflows / Webhooks (n8n) | workflows.md |
| Implementation Notes | implementation.md |

## Recent Updates
- Added project metrics endpoints (`include=metrics`, `/projects/{id}/metrics`)
- Enabled HttpOnly cookie auth (login/refresh)
- Nginx reverse proxy consolidated on port 80
- GitHub Actions CI workflow added
- WebSocket room prefix validation

## Conventions
- All timestamps UTC (timezone-aware)
- JWT in cookies (preferred) or Bearer header (legacy)
- WebSocket token via query param (consider secure extraction in future)

Return to root: `../README.md`
