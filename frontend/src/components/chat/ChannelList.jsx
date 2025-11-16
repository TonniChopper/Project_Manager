// filepath: c:\Project_Manager\frontend\src\components\chat\ChannelList.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const List = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  overflow: auto;
`;

const SectionTitle = styled.div`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  color: ${({ theme }) => theme.text.tertiary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Item = styled(motion.button)`
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    border-left-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.background.secondary};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.border.light};
  }
`;

const Unread = styled.span`
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.gradients.secondary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export default function ChannelList({ channels, activeId, onSelect }) {
  return (
    <List>
      <SectionTitle>Channels</SectionTitle>
      {channels.map(c => (
        <Item
          key={c.id}
          className={c.id === activeId ? 'active' : ''}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(c.id)}
        >
          <span>#{c.name}</span>
          {c.unreadCount > 0 && <Unread>{c.unreadCount}</Unread>}
        </Item>
      ))}
    </List>
  );
}
