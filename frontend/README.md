# Frontend - React Application

Modern, beautiful UI for Project Manager built with React, styled-components, and framer-motion.

## 🎨 Features

- **Real-time Updates**: WebSocket integration for live chat and notifications
- **Authentication**: JWT-based login/register with token refresh
- **Kanban Board**: Drag-and-drop task management with @dnd-kit
- **Chat System**: Markdown support, file previews, typing indicators
- **Settings**: Profile editor, theme switcher, notifications, password change
- **Responsive Design**: Mobile-friendly with adaptive layouts
- **Animations**: Smooth transitions and micro-interactions with framer-motion
- **Glassmorphism UI**: Modern design with backdrop blur and gradients

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

---

## 📁 Structure

```
src/
├── components/          # Reusable components
│   ├── chat/           # Chat-specific components
│   │   ├── ChatLayout.jsx
│   │   ├── ChannelList.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── MessageList.jsx
│   │   └── TypingIndicator.jsx
│   ├── tasks/          # Task management components
│   │   ├── KanbanBoard.jsx
│   │   ├── KanbanColumn.jsx
│   │   ├── TaskCard.jsx
│   │   └── TaskModal.jsx
│   ├── settings/       # Settings components
│   │   ├── ProfileSection.jsx
│   │   ├── AppearanceSection.jsx
│   │   ├── NotificationSection.jsx
│   │   └── PasswordSection.jsx
│   ├── AppLayout.js    # Main layout wrapper
│   ├── NavigationBar.js
│   ├── ThemeToggle.js
│   └── UserMenu.jsx
│
├── pages/              # Route pages
│   ├── Dashboard.js    # Main dashboard
│   ├── Projects.js     # Project list
│   ├── Tasks.js        # Kanban board
│   ├── Chat.js         # Chat interface
│   ├── Settings.js     # User settings
│   └── Login.js        # Login/register
│
├── services/           # API clients
│   ├── api.js          # Axios instance
│   ├── authService.js  # Authentication
│   ├── projectService.js
│   ├── taskService.js
│   ├── chatService.js
│   ├── settingsService.js
│   └── websocketService.js
│
├── theme/              # Styled components theme
│   ├── ThemeProvider.js
│   ├── GlobalStyles.js
│   ├── theme.js
│   └── StyledComponents.js
│
├── App.js              # Main app component
└── index.js            # Entry point
```

---

## 🔌 API Integration

All API calls are centralized in service files:

### Services

**authService** - Authentication
```javascript
import { authService } from './services/authService';

// Login
await authService.login(username, password);

// Register
await authService.register(username, email, password);

// Get current user
const user = authService.getCurrentUser();

// Logout
authService.logout();
```

**projectService** - Projects
```javascript
import projectService from './services/projectService';

// Get all projects
const projects = await projectService.getProjects();

// Create project
const project = await projectService.createProject(data);

// Update project
await projectService.updateProject(id, data);
```

**taskService** - Tasks
```javascript
import taskService from './services/taskService';

// Get tasks
const tasks = await taskService.getTasks();

// Create task
const task = await taskService.createTask(data);

// Update task status
await taskService.updateTaskStatus(id, 'done');
```

**chatService** - Chat
```javascript
import chatService from './services/chatService';

// Get channels
const channels = await chatService.getChannels();

// Get messages
const messages = await chatService.getMessages(channelId);

// Send message
await chatService.sendMessage(channelId, content);
```

**websocketService** - Real-time
```javascript
import websocketService from './services/websocketService';

// Connect with token
const token = localStorage.getItem('access_token');
await websocketService.connect(token);

// Listen for messages
websocketService.on('message', (data) => {
  console.log('New message:', data);
});

// Send message
websocketService.sendMessage(channelId, content);

// Join room
websocketService.joinRoom(channelId);

// Disconnect
websocketService.disconnect();
```

---

## 🎨 Theme System

### Using Theme Components

```javascript
import { 
  GlassCard, 
  NeonButton, 
  GradientText,
  Badge 
} from '../theme';

function MyComponent() {
  return (
    <GlassCard>
      <h2><GradientText>Title</GradientText></h2>
      <Badge $variant="success">Active</Badge>
      <NeonButton onClick={handleClick}>Click Me</NeonButton>
    </GlassCard>
  );
}
```

### Theme Variants

**Badges:**
- `info` (blue)
- `success` (green)
- `warning` (yellow)
- `error` (red)

**Buttons:**
- `primary` (default gradient)
- `secondary` (outline)
- `accent` (purple gradient)

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

---

## 🛠️ Development

### Environment Variables

Create `.env.local` file:

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_WS_URL=ws://localhost:8000/api/v1/ws
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Check types (if using TypeScript)
npm run type-check
```

---

## 📦 Build

```bash
# Production build
npm run build

# Serve build locally
npx serve -s build
```

Build output will be in `build/` directory.

---

## 🎯 Key Features Implementation

### Authentication

- JWT tokens stored in localStorage
- Automatic token refresh
- Protected routes with authentication check
- Redirect to login if unauthenticated

### Real-time Chat

- WebSocket connection with auto-reconnect
- Typing indicators
- Markdown support
- File previews
- Read receipts

### Task Management

- Drag-and-drop with @dnd-kit
- 4 status columns (To Do, In Progress, Review, Done)
- Modal editor for task details
- Real-time updates via WebSocket

### User Settings

- Profile editor with avatar upload
- Theme switcher (light/dark)
- Accent color picker
- Notification preferences
- Password change with strength meter

---

## 🔒 Security

- JWT tokens with HttpOnly cookies (recommended for production)
- CSRF protection
- XSS prevention with sanitization
- Input validation
- Secure WebSocket connection (wss:// in production)

---

## 🚀 Performance

- Code splitting with React.lazy
- Image optimization
- Debounced API calls
- Memoized components with React.memo
- Virtual scrolling for large lists (react-virtuoso)

---

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- Touch-friendly interactions
- Adaptive navigation

---

## 🎨 Design System

### Colors

- Primary: `#667eea` (purple-blue)
- Secondary: `#764ba2` (purple)
- Success: `#10b981` (green)
- Warning: `#f59e0b` (orange)
- Error: `#ef4444` (red)
- Info: `#3b82f6` (blue)

### Typography

- Font Family: Inter, system-ui, sans-serif
- Mono: 'Fira Code', monospace
- Sizes: xs (12px) → xxxl (48px)

### Spacing

- Scale: 0.25rem increments
- xs: 0.25rem
- sm: 0.5rem
- md: 1rem
- lg: 1.5rem
- xl: 2rem
- xxl: 3rem

---

## 📚 Additional Documentation

- [Settings Documentation](./SETTINGS_README.md)
- [Task Board Documentation](./TASK_BOARD_README.md)
- [Project Summary](./PROJECT_SUMMARY.md)

---

## 🐛 Troubleshooting

### Common Issues

**API Connection Failed**
- Check if backend is running on port 8000
- Verify REACT_APP_API_URL in .env.local
- Check CORS settings in backend

**WebSocket Connection Failed**
- Verify REACT_APP_WS_URL in .env.local
- Check if WebSocket endpoint is accessible
- Ensure token is valid

**Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

---

**Ready for production deployment! 🚀**

