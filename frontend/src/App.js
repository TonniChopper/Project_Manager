import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import theme (use direct files to avoid re-export issues)
import ThemeProvider from './theme/ThemeProvider';
import GlobalStyles from './theme/GlobalStyles';

// Import pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Import components
import AppLayout from './components/AppLayout';

function App() {
  // TODO: Add authentication logic
  const isAuthenticated = true; // Set to true for demo

  return (
    <ThemeProvider>
      <GlobalStyles />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/home"
            element={
              isAuthenticated ? (
                <AppLayout>
                  <Home />
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/projects"
            element={
              isAuthenticated ? (
                <AppLayout>
                  <Projects />
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/tasks"
            element={
              isAuthenticated ? (
                <AppLayout>
                  <Tasks />
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/chat"
            element={
              isAuthenticated ? (
                <AppLayout>
                  <Chat />
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
