import React, { useMemo, useState, useEffect } from 'react';
import ChatLayout from '../components/chat/ChatLayout';
import ChannelList from '../components/chat/ChannelList';
import MessageList from '../components/chat/MessageList';
import MessageBubble from '../components/chat/MessageBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import chatService from '../services/chatService';
import websocketService from '../services/websocketService';
import { authService } from '../services/authService';

export default function Chat() {
  const [channels, setChannels] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messagesByChannel, setMessagesByChannel] = useState({});
  const [composer, setComposer] = useState('');
  const [typing, setTyping] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannels();
    setupWebSocket();

    return () => {
      websocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId);
    }
  }, [activeId]);

  const setupWebSocket = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      websocketService.connect(token);

      websocketService.on('message', data => {
        handleNewMessage(data);
      });

      websocketService.on('typing', data => {
        setTyping(prev => ({
          ...prev,
          [data.channel_id]: data.is_typing ? [data.username] : [],
        }));
      });
    }
  };

  const loadChannels = async () => {
    try {
      const data = await chatService.getChannels();
      setChannels(data);
      if (data.length > 0 && !activeId) {
        setActiveId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async channelId => {
    try {
      const data = await chatService.getMessages(channelId);
      const currentUser = authService.getCurrentUser();

      const transformedMessages = data.map(msg => ({
        id: msg.id,
        author: {
          id: msg.author_id,
          name: msg.author_name || 'User',
          avatar: msg.author_avatar || `https://i.pravatar.cc/100?img=${msg.author_id}`,
        },
        mine: msg.author_id === currentUser?.username,
        content: msg.content,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        files: msg.attachments || [],
      }));

      setMessagesByChannel(prev => ({
        ...prev,
        [channelId]: transformedMessages,
      }));

      // Join WebSocket room
      websocketService.joinRoom(channelId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleNewMessage = data => {
    const { channel_id, ...msgData } = data;
    const currentUser = authService.getCurrentUser();

    const transformedMsg = {
      id: msgData.id,
      author: {
        id: msgData.author_id,
        name: msgData.author_name || 'User',
        avatar: msgData.author_avatar || `https://i.pravatar.cc/100?img=${msgData.author_id}`,
      },
      mine: msgData.author_id === currentUser?.username,
      content: msgData.content,
      timestamp: new Date(msgData.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      files: msgData.attachments || [],
    };

    setMessagesByChannel(prev => ({
      ...prev,
      [channel_id]: [...(prev[channel_id] || []), transformedMsg],
    }));
  };

  const activeMessages = useMemo(
    () => messagesByChannel[activeId] || [],
    [messagesByChannel, activeId]
  );

  const handleSend = async () => {
    const text = composer.trim();
    if (!text || !activeId) return;

    try {
      await chatService.sendMessage(activeId, text);
      setComposer('');

      // Message will be added via WebSocket event
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleComposerChange = value => {
    setComposer(value);

    // Send typing indicator
    if (activeId) {
      websocketService.sendTyping(activeId, value.length > 0);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading chat...</div>;
  }

  const sidebar = <ChannelList channels={channels} activeId={activeId} onSelect={setActiveId} />;

  const header = (
    <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <strong>#{channels.find(c => c.id === activeId)?.name || 'channel'}</strong>
    </div>
  );

  const messages = (
    <MessageList>
      {activeMessages.map(m => (
        <MessageBubble
          key={m.id}
          mine={m.mine}
          avatar={m.author.avatar}
          name={m.author.name}
          content={m.content}
          timestamp={m.timestamp}
          files={m.files}
        />
      ))}
      {(typing[activeId] || []).length > 0 && <TypingIndicator />}
    </MessageList>
  );

  return (
    <ChatLayout
      sidebar={sidebar}
      header={header}
      messages={messages}
      composer={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: 16,
            borderTop: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              border: '1px solid rgba(0,0,0,0.08)',
              background: 'transparent',
            }}
          >
            😊
          </button>
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              border: '1px solid rgba(0,0,0,0.08)',
              background: 'transparent',
            }}
          >
            📎
          </button>
          <input
            placeholder="Type a message…"
            value={composer}
            onChange={e => handleComposerChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            style={{
              flex: 1,
              height: 44,
              padding: '0 12px',
              borderRadius: 999,
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '0 16px',
              height: 40,
              borderRadius: 999,
              border: 'none',
              color: 'white',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Send
          </button>
        </div>
      }
    />
  );
}
