// filepath: c:\Project_Manager\frontend\src\components\tasks\KanbanColumn.jsx
import React from 'react';
import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

const Column = styled(motion.div)`
  background: ${({ theme }) => theme.background.glass};
  border: 1px solid ${({ theme }) => theme.border.glass};
  border-radius: ${({ theme }) => theme.radius.xl};
  backdrop-filter: ${({ theme }) => theme.blur.md};
  display: flex;
  flex-direction: column;
  min-height: 500px;
  max-height: 70vh;
  box-shadow: ${({ theme }) => theme.shadows.glass};
  overflow: hidden;

  ${({ $isOver, theme }) =>
    $isOver &&
    `
    border-color: ${theme.colors.primary};
    box-shadow: ${theme.shadows.glow};
    background: ${theme.background.glassHover};
  `}
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.border.glass};
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};

  .blob {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ theme, $gradient }) => theme.gradients[$gradient]};
    box-shadow: 0 0 12px
      ${({ theme, $gradient }) =>
        theme.colors[$gradient === 'cosmic' ? 'primaryGlow' : 'secondaryGlow']};
    animation: pulse 2s ease-in-out infinite;

    @keyframes pulse {
      0%,
      100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.8;
      }
    }
  }
`;

const Count = styled.span`
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.background.tertiary};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.text.secondary};
`;

const Cards = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
`;

export default function KanbanColumn({ id, title, color, gradient, count, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <Column ref={setNodeRef} $isOver={isOver} layout>
      <Header>
        <Title $gradient={gradient}>
          <div className="blob" />
          {title}
        </Title>
        <Count>{count}</Count>
      </Header>
      <Cards>{children}</Cards>
    </Column>
  );
}
