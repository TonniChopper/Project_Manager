// filepath: c:\Project_Manager\frontend\src\components\settings\Slider.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.text.secondary};
`;

const Track = styled.div`
  position: relative;
  width: 100%;
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.background.tertiary};
  cursor: pointer;
`;

const Progress = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.gradients.primary};
  box-shadow: ${({ theme }) => theme.shadows.glow};
  transition: width ${({ theme }) => theme.transitions.normal};
`;

const Thumb = styled(motion.div)`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.md};
  cursor: grab;

  &:active {
    cursor: grabbing;
    box-shadow: ${({ theme }) => theme.shadows.glowLg};
  }
`;

export default function Slider({ min = 0, max = 100, value, onChange, label }) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <Wrapper>
      {label && (
        <Label>
          <span>{label}</span>
          <span>{value}</span>
        </Label>
      )}
      <Track>
        <Progress style={{ width: `${percentage}%` }} />
        <Thumb
          style={{ left: `${percentage}%` }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
      </Track>
    </Wrapper>
  );
}
