import styled from 'styled-components';
import { motion } from 'framer-motion';

// Glass Card Component
export const GlassCard = styled(motion.div)`
  background: ${({ theme }) => theme.background.glass};
  backdrop-filter: ${({ theme }) => theme.blur.md};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.md};
  border: 1px solid ${({ theme }) => theme.border.glass};
  border-radius: ${({ theme, $radius = 'lg' }) => theme.radius[$radius]};
  padding: ${({ theme, $padding = 'lg' }) => theme.spacing[$padding]};
  box-shadow: ${({ theme }) => theme.shadows.glass};
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    background: ${({ theme }) => theme.background.glassHover};
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

// Gradient Card Component
export const GradientCard = styled(motion.div)`
  background: ${({ theme, $gradient = 'primary' }) => theme.gradients[$gradient]};
  border-radius: ${({ theme, $radius = 'xl' }) => theme.radius[$radius]};
  padding: ${({ theme, $padding = 'xl' }) => theme.spacing[$padding]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  color: ${({ theme }) => theme.colors.white};
  position: relative;
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.slow};
  }
  
  &:hover {
    transform: scale(1.02);
    box-shadow: ${({ theme }) => theme.shadows.xxl};
    
    &::before {
      opacity: 1;
    }
  }
`;

// Neon Button Component
export const NeonButton = styled(motion.button)`
  position: relative;
  padding: ${({ theme, $size = 'md' }) => {
    const sizes = {
      sm: `${theme.spacing.sm} ${theme.spacing.md}`,
      md: `${theme.spacing.md} ${theme.spacing.xl}`,
      lg: `${theme.spacing.lg} ${theme.spacing.xxl}`,
    };
    return sizes[$size];
  }};
  font-size: ${({ theme, $size = 'md' }) => {
    const sizes = {
      sm: theme.fontSizes.sm,
      md: theme.fontSizes.md,
      lg: theme.fontSizes.lg,
    };
    return sizes[$size];
  }};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme, $variant = 'primary' }) => {
    const variants = {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      accent: theme.colors.accent,
      gradient: theme.gradients.primary,
    };
    return variants[$variant];
  }};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  cursor: pointer;
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ theme, $variant = 'primary' }) => {
    const shadows = {
      primary: theme.shadows.neon,
      secondary: theme.shadows.neonPink,
      accent: theme.shadows.neonCyan,
      gradient: theme.shadows.glow,
    };
    return shadows[$variant];
  }};
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width ${({ theme }) => theme.transitions.slow},
                height ${({ theme }) => theme.transitions.slow};
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme, $variant = 'primary' }) => {
      const shadows = {
        primary: theme.shadows.glowLg,
        secondary: `0 0 40px ${theme.colors.secondaryGlow}`,
        accent: `0 0 40px ${theme.colors.accentGlow}`,
        gradient: theme.shadows.glowLg,
      };
      return shadows[$variant];
    }};
    
    &::before {
      width: 300px;
      height: 300px;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
    }
  }
`;

// Glass Button Component
export const GlassButton = styled(motion.button)`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.glass};
  backdrop-filter: ${({ theme }) => theme.blur.md};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.md};
  border: 1px solid ${({ theme }) => theme.border.glass};
  border-radius: ${({ theme }) => theme.radius.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ theme }) => theme.shadows.glass};
  
  &:hover {
    background: ${({ theme }) => theme.background.glassHover};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Gradient Text Component
export const GradientText = styled.span`
  background: ${({ theme, $gradient = 'primary' }) => theme.gradients[$gradient]};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
  font-weight: ${({ theme, $weight = 'bold' }) => theme.fontWeights[$weight]};
  
  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
`;

// Input with Glass Effect
export const GlassInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.glass};
  backdrop-filter: ${({ theme }) => theme.blur.md};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.md};
  border: 1px solid ${({ theme }) => theme.border.glass};
  border-radius: ${({ theme }) => theme.radius.lg};
  outline: none;
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.neon};
    background: ${({ theme }) => theme.background.glassHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Floating Action Button
export const FloatingActionButton = styled(motion.button)`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.gradients.primary};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.glowLg};
  z-index: ${({ theme }) => theme.zIndices.sticky};
  transition: all ${({ theme }) => theme.transitions.normal};
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.white};
  }
  
  &:hover {
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 0 60px ${({ theme }) => theme.colors.primaryGlow};
  }
  
  &:active {
    transform: scale(0.95) rotate(90deg);
  }
`;

// Badge Component
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme, $variant = 'primary' }) => {
    const variants = {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
      info: theme.colors.info,
    };
    return variants[$variant];
  }};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme, $variant = 'primary' }) => {
    const shadows = {
      primary: `0 0 10px ${theme.colors.primaryGlow}`,
      secondary: `0 0 10px ${theme.colors.secondaryGlow}`,
      success: `0 0 10px ${theme.colors.successGlow}`,
      warning: `0 0 10px ${theme.colors.warningGlow}`,
      error: `0 0 10px ${theme.colors.errorGlow}`,
      info: `0 0 10px ${theme.colors.infoGlow}`,
    };
    return shadows[$variant];
  }};
  
  ${({ $glow }) => $glow && `
    animation: glow 2s ease-in-out infinite;
  `}
`;

// Animated Container
export const AnimatedContainer = styled(motion.div)`
  width: 100%;
`;

// Skeleton Loader with Shimmer
export const SkeletonLoader = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.background.secondary} 0%,
    ${({ theme }) => theme.background.tertiary} 50%,
    ${({ theme }) => theme.background.secondary} 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: ${({ theme, $radius = 'md' }) => theme.radius[$radius]};
  height: ${({ $height = '20px' }) => $height};
  width: ${({ $width = '100%' }) => $width};
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

// Divider with Gradient
export const GradientDivider = styled.div`
  height: 2px;
  background: ${({ theme, $gradient = 'primary' }) => theme.gradients[$gradient]};
  margin: ${({ theme, $margin = 'xl' }) => `${theme.spacing[$margin]} 0`};
  border-radius: ${({ theme }) => theme.radius.full};
`;

export default {
  GlassCard,
  GradientCard,
  NeonButton,
  GlassButton,
  GradientText,
  GlassInput,
  FloatingActionButton,
  Badge,
  AnimatedContainer,
  SkeletonLoader,
  GradientDivider,
};

