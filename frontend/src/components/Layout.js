import React from 'react';
export default Layout;

}
  );
    </div>
      </footer>
        </div>
          <p>&copy; 2025 Project Manager. All rights reserved.</p>
        <div className="container">
      <footer className="footer">

      </main>
        <div className="container">{children}</div>
      <main className="main">

      </header>
        </div>
          </div>
            </div>
              <button className="btn btn-secondary">Profile</button>
            <div className="header-actions">

            </nav>
              </Link>
                Chat
              <Link to="/chat" className={isActive('/chat') ? 'nav-link active' : 'nav-link'}>
              </Link>
                Tasks
              <Link to="/tasks" className={isActive('/tasks') ? 'nav-link active' : 'nav-link'}>
              </Link>
                Projects
              >
                className={isActive('/projects') ? 'nav-link active' : 'nav-link'}
                to="/projects"
              <Link
              </Link>
                Home
              <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'}>
            <nav className="nav">

            </Link>
              <span className="logo-text">Project Manager</span>
              <span className="logo-icon">📊</span>
            <Link to="/" className="logo">
          <div className="header-content">
        <div className="container">
      <header className="header">
    <div className="layout">
  return (

  const isActive = path => location.pathname === path;

  const location = useLocation();
function Layout({ children }) {

import './Layout.css';
import { Link, useLocation } from 'react-router-dom';

