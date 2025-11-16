// filepath: c:\Project_Manager\frontend\src\services\settingsService.js
import api from './api';

class SettingsService {
  async getUserProfile() {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  }

  async updateUserProfile(data) {
    try {
      const response = await api.patch('/users/me', data);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw error;
    }
  }

  async getUserSettings() {
    try {
      const response = await api.get('/users/me/settings');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      throw error;
    }
  }

  async updateUserSettings(data) {
    try {
      const response = await api.patch('/users/me/settings', data);
      return response.data;
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/users/me/password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }

  async getNotificationSettings() {
    try {
      const response = await api.get('/users/me/notifications');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
      throw error;
    }
  }

  async updateNotificationSettings(data) {
    try {
      const response = await api.patch('/users/me/notifications', data);
      return response.data;
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    }
  }
}

export default new SettingsService();
