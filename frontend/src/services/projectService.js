import api from './api';

class ProjectService {
  async getProjects(params = {}) {
    try {
      const response = await api.get('/projects', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  }

  async getProject(id) {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch project:', error);
      throw error;
    }
  }

  async createProject(data) {
    try {
      const response = await api.post('/projects', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  }

  async updateProject(id, data) {
    try {
      const response = await api.patch(`/projects/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  }

  async deleteProject(id) {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  }
}

export default new ProjectService();
