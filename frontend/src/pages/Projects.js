import React, { useState, useEffect } from 'react';
import './Projects.css';
import projectService from '../services/projectService';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      const newProject = await projectService.createProject({
        name: 'New Project',
        description: 'Project description',
        status: 'planning',
      });
      setProjects(prev => [newProject, ...prev]);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  if (loading) {
    return (
      <div className="projects-page">
        <div className="page-header">
          <h1>Projects</h1>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="page-header">
        <h1>Projects</h1>
        <button className="btn btn-primary" onClick={handleCreateProject}>
          + New Project
        </button>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Projects
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'planning' ? 'active' : ''}`}
          onClick={() => setFilter('planning')}
        >
          Planning
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📁</div>
          <h2>No projects yet</h2>
          <p>Create your first project to get started</p>
          <button className="btn btn-primary" onClick={handleCreateProject}>
            Create Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <div key={project.id} className="project-card card">
              <div className="project-header">
                <h3>{project.name}</h3>
                <span className={`status-badge ${project.status}`}>{project.status}</span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-meta">
                <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;
