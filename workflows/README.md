[← Back to Index](../docs/INDEX.md)

# Workflows Directory

## Purpose
This directory contains automation workflows and integrations for n8n and related tooling.

## Contents

### n8n/
Exports of n8n workflows used to automate project processes.

### scripts/
Python scripts for automation tasks (backups, cleanup, reporting, sync).

### templates/
Starter templates for creating new workflows.

---

## n8n Workflows

### Already included
- `n8n_workflow_example.json` (at the repository root) – example workflow for task notifications

### How to use

1) Import into n8n
```bash
# Start n8n quickly (example)
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
# Open http://localhost:5678
# Workflows → Import from File → choose JSON
```

2) Export from n8n
- Open the workflow in n8n
- Settings → Export Workflow
- Save the JSON file under `workflows/n8n/`

3) Environment variables
```env
N8N_URL=http://localhost:5678
WORKFLOWS_URL=http://localhost:5678
```

---

## Python Scripts

### Structure
```
workflows/scripts/
├── backup_db.py          # Database backups
├── cleanup_old_data.py   # Old data cleanup
├── generate_reports.py   # Report generation
├── sync_external.py      # Sync with external systems
└── __init__.py
```

### Example usage
```bash
# Cron / scheduler
echo "0 2 * * * /usr/bin/python /app/workflows/scripts/backup_db.py" | crontab -

# Or execute via n8n Execute Command node
```

---

## Available Workflows

### 1) Task Notifications (ready)
File: `../n8n_workflow_example.json`

Features:
- Slack notification on task creation
- Email on task assignment
- Jira integration on task completion

Events:
- `task.created`
- `task.assigned`
- `task.completed`

### 2) Project Reports (planned)
File: `n8n/project_reports.json`

Features:
- Weekly project reports
- Slack/Email delivery
- Save to Google Sheets

### 3) User Onboarding (planned)
File: `n8n/user_onboarding.json`

Features:
- Welcome email
- Provision accounts in external services
- Team assignments

---

## Integrations
Supported services:
- Slack – notifications and commands
- Email (SMTP)
- Jira – create issues
- Google Sheets – reporting
- Telegram – bots and alerts
- Discord – webhook notifications
- Microsoft Teams – notifications
- Trello – task synchronization

---

## Creating a New Workflow

Step 1: Build in n8n
1. Open n8n
2. Create new workflow
3. Add a Webhook Trigger node
4. Use URL like: `/webhook/project-manager-<name>`

Step 2: Configure in Project Manager
```python
# In code or via admin API
webhook_url = "http://n8n:5678/webhook/project-manager-custom"
```

Step 3: Export & commit
1. Save & activate the workflow
2. Export → JSON
3. Save under `workflows/n8n/`
4. Commit to Git

---

## Testing Workflows

Local testing:
```bash
# Example: run a simple mock
python - <<'PY'
from fastapi import FastAPI, Request
import uvicorn
app = FastAPI()
@app.post('/webhook/test')
async def recv(req: Request):
    data = await req.json()
    print('Received', data.get('event',{}).get('type'))
    return {"ok": True}
uvicorn.run(app, host='0.0.0.0', port=5678)
PY

# Send a test payload
curl -X POST http://localhost:5678/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"event":{"type":"task.created"}}'
```

Sample payloads directory (recommended to add later):
```
workflows/test_payloads/
├── project_created.json
├── task_created.json
├── task_assigned.json
└── task_completed.json
```

---

## Monitoring

n8n Executions:
```
http://localhost:5678
→ Choose a workflow
→ Executions tab
```

Project Manager webhook logs:
```bash
GET /api/v1/webhooks/stats
GET /api/v1/webhooks/events?limit=100
GET /api/v1/webhooks/events/failed/recent
```

---

## Production Deployment

Docker Compose (snippet):
```yaml
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=password
    volumes:
      - ./workflows/n8n:/home/node/.n8n/workflows
```

Kubernetes (example):
```bash
# Placeholder for Helm chart usage
helm install n8n ./workflows/helm/n8n
```

---

## Documentation
- n8n Docs: https://docs.n8n.io/
- Webhook API: `../WEBHOOK_INTEGRATION.md`
- Quick Start: `../WEBHOOK_QUICKSTART.md`

---

Last Updated: 2025-11-14  
Version: 1.0
