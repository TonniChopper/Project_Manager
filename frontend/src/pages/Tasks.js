import React, { useState } from 'react';
import './Tasks.css';

function Tasks() {
  const [tasks] = useState([]);
  const [filter, setFilter] = useState('all');

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1>Tasks</h1>
        <button className="btn btn-primary">+ New Task</button>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Tasks
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">✓</div>
          <h2>No tasks yet</h2>
          <p>Create your first task to get started</p>
          <button className="btn btn-primary">Create Task</button>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task.id} className="task-item card">
              <div className="task-checkbox">
                <input type="checkbox" checked={task.completed} readOnly />
              </div>
              <div className="task-content">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span className="priority">{task.priority}</span>
                  <span className="due-date">{task.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;

