# Frontend Development Guide

## 🎨 Overview

The Project Manager frontend is built with React 18 and follows modern best practices for component-based architecture, state management, and API integration.

## 🏗️ Architecture

### Component Structure

```
src/
├── components/         # Reusable components
│   ├── Layout.js      # Main layout wrapper
│   ├── Button.js      # Custom button component
│   ├── Card.js        # Card wrapper component
│   └── Spinner.js     # Loading spinner
├── pages/             # Route-level page components
│   ├── Home.js        # Dashboard/home page
│   ├── Projects.js    # Projects list
│   ├── Tasks.js       # Tasks list
│   ├── Chat.js        # Real-time chat
│   └── Login.js       # Authentication page
├── services/          # API and business logic
│   ├── api.js         # Axios instance with interceptors
│   ├── authService.js # Authentication logic
│   └── websocketService.js # WebSocket management
└── styles/            # Global styles (future)
```

## 🎯 Design System

### Color Palette

```css
Primary:    #6366f1 (Indigo)
Secondary:  #ec4899 (Pink)
Success:    #10b981 (Green)
Warning:    #f59e0b (Amber)
Error:      #ef4444 (Red)
```

### CSS Variables

All colors and design tokens are defined in `index.css` as CSS custom properties:

```css
--primary-color: #6366f1;
--primary-dark: #4f46e5;
--primary-light: #818cf8;
--text-primary: #1f2937;
--text-secondary: #6b7280;
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--border-color: #e5e7eb;
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--border-radius: 8px;
```

### Utility Classes

Common utility classes are available in `index.css`:

- `.container` - Max-width wrapper
- `.btn`, `.btn-primary`, `.btn-secondary` - Button styles
- `.card` - Card container with shadow
- `.spinner` - Loading indicator

## 🚦 Routing

Routes are defined in `App.js` using React Router v6:

| Route | Component | Protected | Description |
|-------|-----------|-----------|-------------|
| `/` | Home | Yes | Dashboard with stats |
| `/projects` | Projects | Yes | Projects list |
| `/tasks` | Tasks | Yes | Tasks management |
| `/chat` | Chat | Yes | Real-time messaging |
| `/login` | Login | No | Authentication |

Protected routes redirect to `/login` if user is not authenticated.

## 🔐 Authentication Flow

### Login Process

1. User submits credentials via `Login` page
2. `authService.login()` sends POST to `/api/v1/auth/login`
3. Server responds with `access_token`, `refresh_token`, and `user` data
4. Tokens stored in `localStorage`
5. User redirected to dashboard

### Token Management

```javascript
// Access token automatically attached to all API requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-redirect on 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 📡 API Integration

### Making API Calls

All API requests go through the `api` service:

```javascript
import api from '../services/api';

// GET request
const response = await api.get('/projects');

// POST request
const response = await api.post('/projects', {
  name: 'New Project',
  description: 'Project description'
});

// PUT request
const response = await api.put(`/projects/${id}`, updateData);

// DELETE request
await api.delete(`/projects/${id}`);
```

### Error Handling

```javascript
try {
  const response = await api.get('/projects');
  setProjects(response.data);
} catch (error) {
  console.error('Error fetching projects:', error);
  // Handle error (show toast, etc.)
}
```

## 🌐 WebSocket Integration

### Connecting to WebSocket

```javascript
import websocketService from '../services/websocketService';

// Connect with JWT token
const token = localStorage.getItem('access_token');
websocketService.connect(token);

// Listen for events
websocketService.on('connected', data => {
  console.log('WebSocket connected:', data);
});

websocketService.on('message', data => {
  console.log('New message:', data);
  // Update UI
});

// Send message
websocketService.sendMessage('channel:123', 'Hello world!');

// Join room
websocketService.joinRoom('channel:123');

// Disconnect
websocketService.disconnect();
```

### Event Types

- `connected` - Connection established
- `disconnected` - Connection closed
- `error` - Error occurred
- `joined_room` - Successfully joined room
- `left_room` - Left room
- `user_joined` - Another user joined
- `user_left` - User left room
- `message` - New message received
- `pong` - Heartbeat response

## 🧩 Component Development

### Creating New Components

1. Create component file in `src/components/`
2. Create corresponding CSS file
3. Export component as default
4. Document props with comments

Example:

```javascript
import React from 'react';
import './MyComponent.css';

/**
 * MyComponent - Description
 * 
 * @param {string} title - Component title
 * @param {function} onClick - Click handler
 * @param {node} children - Child elements
 */
function MyComponent({ title, onClick, children }) {
  return (
    <div className="my-component" onClick={onClick}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default MyComponent;
```

## 🎨 Styling Guidelines

### CSS Best Practices

1. Use CSS variables for colors and spacing
2. Keep component styles in separate CSS files
3. Use meaningful class names (BEM-style)
4. Avoid inline styles unless dynamic
5. Use flexbox/grid for layouts
6. Make designs responsive (mobile-first)

### Example Component CSS

```css
.my-component {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.my-component:hover {
  box-shadow: var(--shadow-md);
}

.my-component__title {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.my-component__content {
  color: var(--text-secondary);
}
```

## 📱 Responsive Design

Use media queries for responsive layouts:

```css
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 🧪 Testing

### Running Tests

```bash
npm test              # Run tests in watch mode
npm test -- --coverage # Run with coverage report
```

### Writing Tests

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  const button = screen.getByText(/click me/i);
  expect(button).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  
  fireEvent.click(screen.getByText(/click/i));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## 🚀 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Environment Variables

Create `.env.production` for production settings:

```env
REACT_APP_API_URL=https://api.yourapp.com/api/v1
REACT_APP_WS_URL=wss://api.yourapp.com/api/v1/ws
```

## 📝 TODO & Roadmap

### Phase 1 - Core Features
- [x] Basic routing setup
- [x] Authentication pages
- [x] Main layout component
- [ ] Complete authentication flow
- [ ] Project CRUD operations
- [ ] Task CRUD operations

### Phase 2 - Real-time Features
- [ ] WebSocket chat implementation
- [ ] Real-time notifications
- [ ] Live task updates
- [ ] Presence indicators

### Phase 3 - UX Enhancements
- [ ] Dark mode toggle
- [ ] Animations and transitions
- [ ] Drag-and-drop for tasks
- [ ] Rich text editor for descriptions
- [ ] File upload support

### Phase 4 - Advanced Features
- [ ] Search functionality
- [ ] Filters and sorting
- [ ] Kanban board view
- [ ] Calendar view
- [ ] Analytics dashboard
- [ ] User settings page

## 🤝 Contributing

1. Follow the ESLint and Prettier configurations
2. Write meaningful component and variable names
3. Add comments for complex logic
4. Test your components
5. Keep components small and focused
6. Use functional components with hooks

## 📚 Resources

- [React Documentation](https://react.dev/)
- [React Router v6](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

