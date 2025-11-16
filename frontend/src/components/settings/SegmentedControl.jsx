// filepath: c:\Project_Manager\frontend\src\components\settings\SegmentedControl.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Wrapper = styled.div`
  display: inline-flex;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.background.glass};
  border: 1px solid ${({ theme }) => theme.border.glass};
  border-radius: ${({ theme }) => theme.radius.full};
  padding: ${({ theme }) => theme.spacing.xs};
  backdrop-filter: ${({ theme }) => theme.blur.md};
`;

const Option = styled(motion.button)`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.gradients.primary : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.text.secondary)};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  text-transform: capitalize;
  white-space: nowrap;

  &:hover {
    color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.primary)};
  }
`;

export default function SegmentedControl({ options, value, onChange }) {
  return (
    <Wrapper>
      {options.map(opt => (
        <Option
          key={opt}
          $active={value === opt}
          onClick={() => onChange(opt)}
          whileTap={{ scale: 0.95 }}
        >
          {opt}
        </Option>
      ))}
    </Wrapper>
  );
}
