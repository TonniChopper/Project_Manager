import React, { useMemo, useState } from 'react';
import ChatLayout from '../components/chat/ChatLayout';
import ChannelList from '../components/chat/ChannelList';
import MessageList from '../components/chat/MessageList';
import MessageBubble from '../components/chat/MessageBubble';
import TypingIndicator from '../components/chat/TypingIndicator';

const mockUsers = {
  me: { id: 'u1', name: 'You', avatar: 'https://i.pravatar.cc/100?img=1' },
  alex: { id: 'u2', name: 'Alex', avatar: 'https://i.pravatar.cc/100?img=2' },
  sam: { id: 'u3', name: 'Sam', avatar: 'https://i.pravatar.cc/100?img=3' },
};

const initialChannels = [
  { id: 'c1', name: 'general', unreadCount: 2 },
  { id: 'c2', name: 'design', unreadCount: 0 },
  { id: 'c3', name: 'dev', unreadCount: 4 },
];

const initialMessages = {
  c1: [
    {
      id: 'm1',
      author: mockUsers.alex,
      mine: false,
      content: 'Welcome to the team! **Bold** _italic_ and a [link](https://example.com) 🎉',
      timestamp: '09:20',
    },
    {
      id: 'm2',
      author: mockUsers.me,
      mine: true,
      content:
        "Thanks! Let's build something amazing.\n\n`inline code` and:\n\n- list item\n- another item",
      timestamp: '09:21',
    },
  ],
  c2: [
    {
      id: 'm3',
      author: mockUsers.sam,
      mine: false,
      content: 'New color palette is up.',
      timestamp: '08:00',
      files: [
        {
          id: 'f1',
          type: 'image',
          name: 'palette.png',
          url: 'https://picsum.photos/seed/palette/400/300',
        },
      ],
    },
  ],
  c3: [],
};

export default function Chat() {
  const [channels] = useState(initialChannels);
  const [activeId, setActiveId] = useState('c1');
  const [messagesByChannel, setMessagesByChannel] = useState(initialMessages);
  const [composer, setComposer] = useState('');
  const [typing] = useState({ c1: ['Alex'], c2: [], c3: [] });

  const activeMessages = useMemo(
    () => messagesByChannel[activeId] || [],
    [messagesByChannel, activeId]
  );

  const handleSend = () => {
    const text = composer.trim();
    if (!text) return;
    const newMsg = {
      id: `m${Date.now()}`,
      author: mockUsers.me,
      mine: true,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessagesByChannel(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg],
    }));
    setComposer('');
  };

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
            onChange={e => setComposer(e.target.value)}
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
