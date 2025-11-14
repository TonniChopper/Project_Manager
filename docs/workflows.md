[← Back to Index](./INDEX.md)

# Workflows and Webhooks (n8n)

This page consolidates quickstart and full integration details for outgoing webhooks and n8n workflows.

## Summary
- Webhooks are emitted for project/task lifecycle events
- Standardized payload format
- Retries with exponential backoff
- Full audit logging and admin monitoring endpoints

## Configuration
Set in `.env`:
```env
# n8n base or full webhook URL
N8N_URL=http://localhost:5678
# or
N8N_URL=http://localhost:5678/webhook/project-manager
```

## Events
- project.created, project.updated, project.deleted
- task.created, task.updated, task.assigned, task.completed, task.deleted

## Payload
```json
{
  "event": {"type": "task.created", "timestamp": "...", "source": "project_manager_api"},
  "entity": {"type": "task", "id": 123, "data": {"title": "..."}},
  "user": {"id": 7, "data": {"username": "alice", "email": "alice@example.com"}},
  "metadata": {"project_name": "Backend API"}
}
```

## Retries & Timeouts
- Timeout: 10s
- Retries: 3 (1s, 2s, 3s)
- Success: HTTP 2xx-3xx
- On failure: stored with details and error message

## Admin Monitoring
Endpoints (admin auth required):
- GET `/api/v1/webhooks/events?limit=100&event_type=...&success_only=...`
- GET `/api/v1/webhooks/events/{event_id}`
- GET `/api/v1/webhooks/events/failed/recent`
- GET `/api/v1/webhooks/stats`

## n8n Setup
1) Import `n8n_workflow_example.json` in n8n
2) Activate webhook trigger → copy URL
3) Set `N8N_URL` in `.env`

## Testing
- Manual: create a project/task via API and watch n8n executions
- Automated: `pytest backend/tests/test_webhooks.py -v`

## Security
- Use HTTPS in production
- Consider webhook signing (future)
- Restrict n8n to internal networks when possible

## Code Locations
- Service: `backend/app/services/webhooks.py`
- API (admin): `backend/app/api/v1/webhooks.py`
- DB model: `backend/app/db/models.py` (WebhookEvent)
- Schemas: `backend/app/schemas/webhook.py`

Last Updated: 2025-11-14
