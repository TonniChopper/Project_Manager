import api from './api';

class ChatService {
  async getChannels() {
    try {
      const response = await api.get('/channels');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch channels:', error);
      throw error;
    }
  }

  async getChannel(id) {
    try {
      const response = await api.get(`/channels/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch channel:', error);
      throw error;
    }
  }

  async createChannel(data) {
    try {
      const response = await api.post('/channels', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create channel:', error);
      throw error;
    }
  }

  async getMessages(channelId, params = {}) {
    try {
      const response = await api.get(`/channels/${channelId}/messages`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error;
    }
  }

  async sendMessage(channelId, content, attachments = []) {
    try {
      const response = await api.post('/messages', {
        channel_id: channelId,
        content,
        attachments,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async updateMessage(id, content) {
    try {
      const response = await api.patch(`/messages/${id}`, { content });
      return response.data;
    } catch (error) {
      console.error('Failed to update message:', error);
      throw error;
    }
  }

  async deleteMessage(id) {
    try {
      const response = await api.delete(`/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  }
}

export default new ChatService();
