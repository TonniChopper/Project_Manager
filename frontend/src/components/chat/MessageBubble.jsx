// filepath: c:\Project_Manager\frontend\src\components\chat\MessageBubble.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import MarkdownRenderer from './MarkdownRenderer';
import FilePreview from './FilePreview';

const Row = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => `${theme.spacing.sm} 0`};
  justify-content: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: ${({ $mine }) => ($mine ? 'none' : 'block')};
`;

const Bubble = styled(motion.div)`
  max-width: 70%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme, $mine }) => ($mine ? theme.gradients.primary : theme.background.glass)};
  color: ${({ theme, $mine }) => ($mine ? theme.colors.white : theme.text.primary)};
  border: 1px solid ${({ theme, $mine }) => ($mine ? 'transparent' : theme.border.glass)};
  position: relative;
  box-shadow: ${({ theme, $mine }) => ($mine ? theme.shadows.glow : theme.shadows.glass)};

  p {
    margin: 0.25rem 0;
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
  opacity: 0.75;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  justify-content: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
`;

const Name = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Timestamp = styled.span`
  color: ${({ theme }) => theme.text.tertiary};
`;

const Receipt = styled.span`
  color: ${({ theme }) => theme.colors.white};
  ${({ $mine, theme }) =>
    $mine &&
    `
      display: inline-flex;
      align-items: center;
      gap: ${theme.spacing.xs};
      &::after {
        content: '✔✔';
        font-size: 0.8em;
        text-shadow: 0 0 10px ${theme.colors.primaryGlow};
      }
    `}
`;

export default function MessageBubble({ mine, avatar, name, content, timestamp, files }) {
  return (
    <Row $mine={mine}>
      <Avatar src={avatar} alt={name} $mine={mine} />
      <div>
        <Bubble
          $mine={mine}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <MarkdownRenderer>{content}</MarkdownRenderer>
          <FilePreview files={files} />
        </Bubble>
        <Meta $mine={mine}>
          {!mine && <Name>{name}</Name>}
          <Timestamp>{timestamp}</Timestamp>
          {mine && <Receipt $mine={mine} />}
        </Meta>
      </div>
    </Row>
  );
}
