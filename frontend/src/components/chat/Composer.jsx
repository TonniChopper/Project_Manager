// filepath: c:\Project_Manager\frontend\src\components\chat\Composer.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.border.light};
  background: ${({ theme }) => theme.background.elevated};
`;

const Input = styled.input`
  flex: 1;
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.border.medium};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.primary};
`;

const IconBtn = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.background.glass};
  border: 1px solid ${({ theme }) => theme.border.glass};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SendBtn = styled(motion.button)`
  padding: 0 18px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.gradients.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export default function Composer({ value, onChange, onSend, onAttach, onEmoji }) {
  return (
    <Bar>
      <IconBtn whileTap={{ scale: 0.95 }} onClick={onEmoji} aria-label="Insert emoji">
        😊
      </IconBtn>
      <IconBtn whileTap={{ scale: 0.95 }} onClick={onAttach} aria-label="Attach file">
        📎
      </IconBtn>
      <Input
        placeholder="Type a message…"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <SendBtn whileTap={{ scale: 0.98 }} onClick={onSend}>
        Send
      </SendBtn>
    </Bar>
  );
}
