# Frontend Overview

React 18 application providing rich UI: Dashboard (project metrics), Kanban board, real-time chat, settings & theming.

## Tech Stack
- React 18, styled-components, framer-motion
- Axios (REST), native WebSocket API
- Drag & Drop: @dnd-kit (Kanban)
- Theming: light/dark, gradient & glassmorphism components

## Key Integrations
- Metrics: consumes `/projects?include=metrics` (progress, velocity, overdue)
- Auth: reads access/refresh from HttpOnly cookies (fallback localStorage during dev)
- WebSockets: `ws://.../api/v1/ws/connect?token=ACCESS_TOKEN` rooms `project:{id}`, `channel:{id}`, `task:{id}`

## Directory Highlights
```
frontend/
  src/
    pages/ (Dashboard, Projects, Tasks, Chat, Settings, Login)
    components/ (navigation, chat, tasks, settings, shared UI)
    services/ (api, auth, project, task, settings, websocket)
    theme/ (ThemeProvider, GlobalStyles, design tokens)
```

## Environment
`.env.local` (development overrides):
```
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_WS_URL=ws://localhost:8000/api/v1/ws
```
Production: use HTTPS + Secure cookies, avoid storing JWT in localStorage.

## Common Commands
```bash
npm install
npm start
npm run build
npm run lint
npm test
```

## Authentication Notes
- Login/refresh set HttpOnly cookies (backend) and return JSON tokens
- Transition plan: remove direct token storage when migrating fully to cookies

## Dashboard Metrics Mapping
Backend -> UI fields:
| Field | UI Usage |
|-------|----------|
| `progress_percent` | Progress bar width |
| `velocity_7d` | Velocity label |
| `overdue_tasks` | Overdue badge/error tint |
| `completed_tasks/total_tasks` | Tasks summary text |

## WebSocket Events Consumed
- `message`, `user_joined`, `user_left`, `task.*`, `project.*`, `notification.*`

## Testing
```bash
npm test -- --watchAll=false
```
Focus: component rendering (Dashboard metrics), service stubs, websocket flow.

## Roadmap (Frontend)
- Cookie-only auth & CSRF token
- Persist channel messages in DB + optimistic UI
- Offline queue & reconnect backoff
- Performance: code splitting for heavy routes

See root `README.md` and `docs/websockets.md` for extended details.
