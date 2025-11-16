import React, { useState } from 'react';
import './Projects.css';

function Projects() {
  const [projects] = useState([]);

  return (
    <div className="projects-page">
      <div className="page-header">
        <h1>Projects</h1>
        <button className="btn btn-primary">+ New Project</button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📋</div>
          <h2>No projects yet</h2>
          <p>Create your first project to get started</p>
          <button className="btn btn-primary">Create Project</button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-meta">
                <span className="badge">{project.status}</span>
                <span className="task-count">{project.taskCount} tasks</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;
