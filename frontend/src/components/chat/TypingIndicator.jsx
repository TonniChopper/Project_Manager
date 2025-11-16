// filepath: c:\Project_Manager\frontend\src\components\chat\TypingIndicator.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
`;

const Bubble = styled.div`
  align-self: flex-start;
  background: ${({ theme }) => theme.background.glass};
  border: 1px solid ${({ theme }) => theme.border.glass};
  color: ${({ theme }) => theme.text.secondary};
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radius.lg};
  display: inline-flex;
  gap: 6px;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  animation: ${pulse} 1.4s infinite ease-in-out both;

  &:nth-child(2) {
    animation-delay: -0.16s;
  }
  &:nth-child(3) {
    animation-delay: -0.32s;
  }
`;

export default function TypingIndicator() {
  return (
    <Bubble aria-live="polite" aria-label="Someone is typing">
      <Dot />
      <Dot />
      <Dot />
    </Bubble>
  );
}
