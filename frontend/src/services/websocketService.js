const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/api/v1/ws';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect(token) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    const url = `${WS_BASE_URL}/connect?token=${token}`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connected', {});
    };

    this.socket.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        this.emit(data.type, data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = error => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.emit('disconnected', {});
      this.attemptReconnect(token);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(type, data = {}, room = null) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const message = { type, data };
      if (room) {
        message.room = room;
      }
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  joinRoom(roomId) {
    this.send('join_room', {}, roomId);
  }

  leaveRoom(roomId) {
    this.send('leave_room', {}, roomId);
  }

  sendMessage(roomId, content) {
    this.send('send_message', { content }, roomId);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  attemptReconnect(token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        console.log(
          `Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})...`
        );
        this.reconnectAttempts++;
        this.connect(token);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }
}

export default new WebSocketService();
