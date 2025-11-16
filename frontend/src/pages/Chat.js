import React, { useState } from 'react';
import './Chat.css';

function Chat() {
  const [messages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      // TODO: Send message via WebSocket
      setNewMessage('');
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-container card">
        <div className="chat-header">
          <h2>Team Chat</h2>
          <span className="online-status">🟢 Online</span>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-icon">💬</div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="message">
                <div className="message-author">{msg.author}</div>
                <div className="message-content">{msg.content}</div>
                <div className="message-time">{msg.timestamp}</div>
              </div>
            ))
          )}
        </div>

        <div className="message-input-container">
          <input
            type="text"
            className="message-input"
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button className="btn btn-primary" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
