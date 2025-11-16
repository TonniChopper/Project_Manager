// filepath: c:\Project_Manager\frontend\src\components\settings\ToggleSwitch.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Switch = styled.button`
  position: relative;
  width: 52px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  cursor: pointer;
  background: ${({ $checked, theme }) =>
    $checked ? theme.gradients.primary : theme.background.tertiary};
  transition: background ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ $checked, theme }) => ($checked ? theme.shadows.glow : theme.shadows.inner)};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const Handle = styled(motion.div)`
  position: absolute;
  top: 2px;
  left: ${({ $checked }) => ($checked ? 'calc(100% - 26px)' : '2px')};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: left ${({ theme }) => theme.transitions.normal};
`;

export default function ToggleSwitch({ checked, onChange }) {
  return (
    <Switch
      $checked={checked}
      onClick={() => onChange(!checked)}
      aria-checked={checked}
      role="switch"
    >
      <Handle
        $checked={checked}
        animate={{ scale: checked ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      />
    </Switch>
  );
}
