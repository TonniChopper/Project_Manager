import api from './api';

class TaskService {
  async getTasks(params = {}) {
    try {
      const response = await api.get('/tasks', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  }

  async getTask(id) {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch task:', error);
      throw error;
    }
  }

  async createTask(data) {
    try {
      const response = await api.post('/tasks', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  }

  async updateTask(id, data) {
    try {
      const response = await api.patch(`/tasks/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  }

  async deleteTask(id) {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  }

  async updateTaskStatus(id, status) {
    try {
      const response = await api.patch(`/tasks/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Failed to update task status:', error);
      throw error;
    }
  }
}

export default new TaskService();
