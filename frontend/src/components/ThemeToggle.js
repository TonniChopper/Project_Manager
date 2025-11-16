import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';

const ToggleContainer = styled.div`
  position: relative;
  width: 60px;
  height: 30px;
  background: ${({ theme, $isDark }) => ($isDark ? theme.colors.gray700 : theme.colors.gray300)};
  border-radius: ${({ theme }) => theme.radius.full};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ theme }) => theme.shadows.inner};
  overflow: hidden;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const ToggleSwitch = styled(motion.div)`
  position: absolute;
  top: 3px;
  left: ${({ $isDark }) => ($isDark ? '33px' : '3px')};
  width: 24px;
  height: 24px;
  background: ${({ theme, $isDark }) =>
    $isDark ? theme.gradients.aurora : theme.gradients.sunset};
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left ${({ theme }) => theme.transitions.normal};
`;

const Icon = styled.span`
  font-size: 14px;
  line-height: 1;
`;

const Label = styled.span`
  margin-left: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.text.secondary};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ThemeToggle = ({ showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Wrapper>
      <ToggleContainer
        onClick={toggleTheme}
        $isDark={isDark}
        role="button"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleTheme();
          }
        }}
      >
        <ToggleSwitch
          $isDark={isDark}
          initial={false}
          animate={{
            rotate: isDark ? 360 : 0,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
        >
          <Icon>{isDark ? '🌙' : '☀️'}</Icon>
        </ToggleSwitch>
      </ToggleContainer>
      {showLabel && <Label>{isDark ? 'Dark' : 'Light'} Mode</Label>}
    </Wrapper>
  );
};

export default ThemeToggle;
