# Frontend - React Project Manager

Modern React-based frontend for the Project Manager platform.

## 🚀 Features

- **React 18** with functional components and hooks
- **React Router v6** for navigation
- **Axios** for API communication
- **WebSocket** support for real-time features
- **ESLint + Prettier** for code quality
- **Responsive design** with modern CSS

## 📁 Project Structure

```
frontend/
├── public/               # Static files
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/      # Reusable components
│   │   └── Layout.js
│   ├── pages/          # Page components
│   │   ├── Home.js
│   │   ├── Projects.js
│   │   ├── Tasks.js
│   │   ├── Chat.js
│   │   └── Login.js
│   ├── services/       # API and WebSocket services
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── websocketService.js
│   ├── styles/         # Global styles
│   ├── App.js          # Main app component
│   ├── App.css
│   ├── index.js        # Entry point
│   └── index.css       # Global CSS with variables
├── .eslintrc.json
├── .prettierrc
├── package.json
└── README.md
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

## 🔧 Configuration

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_WS_URL=ws://localhost:8000/api/v1/ws
```

## 🎨 Design System

The project uses CSS variables for consistent theming:

- **Primary Color**: `#6366f1` (Indigo)
- **Secondary Color**: `#ec4899` (Pink)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)

## 📱 Pages

### Home (`/`)
- Dashboard with statistics
- Quick actions
- Recent activity

### Projects (`/projects`)
- List of all projects
- Create new project
- Project cards with status

### Tasks (`/tasks`)
- Task list with filters
- Create new task
- Task status management

### Chat (`/chat`)
- Real-time messaging
- WebSocket integration
- Room-based communication

### Login (`/login`)
- User authentication
- Registration form
- Password reset

## 🔐 Authentication

The app uses JWT tokens for authentication:

1. User logs in via `/login`
2. Access token stored in `localStorage`
3. Token automatically attached to API requests
4. Refresh token used for token renewal

## 🌐 API Integration

All API calls go through the `api.js` service with:
- Automatic token injection
- Error handling
- Response interceptors

## 📡 WebSocket

Real-time features use WebSocket service:
- Auto-reconnection
- Event-based messaging
- Room management

## 🚦 Routing

Protected routes redirect to `/login` if user is not authenticated.

## 📝 TODO

- [ ] Implement full authentication flow
- [ ] Add project CRUD operations
- [ ] Add task CRUD operations
- [ ] Complete WebSocket chat integration
- [ ] Add user profile management
- [ ] Add notifications
- [ ] Add dark mode
- [ ] Add animations and transitions
- [ ] Add tests

## 🤝 Contributing

Follow the ESLint and Prettier configurations for consistent code style.

