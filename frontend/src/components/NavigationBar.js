import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { Badge } from '../theme';

// Navigation Container
const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  z-index: ${({ theme }) => theme.zIndices.sticky};
  background: ${({ theme }) => theme.background.glass};
  backdrop-filter: ${({ theme }) => theme.blur.lg};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.lg};
  border-bottom: 1px solid ${({ theme }) => theme.border.glass};
  box-shadow: ${({ theme }) => theme.shadows.glass};
`;

const NavContent = styled.div`
  max-width: 100%;
  height: 100%;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
`;

// Logo Section
const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  position: relative;
`;

const LogoIcon = styled(motion.div)`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  background: ${({ theme }) => theme.gradients.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.glow};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: ${({ theme }) => theme.gradients.primary};
    border-radius: ${({ theme }) => theme.radius.lg};
    opacity: 0;
    filter: blur(8px);
    transition: opacity ${({ theme }) => theme.transitions.normal};
  }

  &:hover::before {
    opacity: 0.6;
  }
`;

const LogoText = styled(motion.span)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  background: ${({ theme }) => theme.gradients.primary};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;

  @keyframes gradientShift {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuToggle = styled(motion.button)`
  display: none;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.background.glass};
  border: 1px solid ${({ theme }) => theme.border.glass};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme }) => theme.background.glassHover};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

// Main Menu
const MainMenu = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 768px) {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: ${({ theme }) => theme.background.glass};
    backdrop-filter: ${({ theme }) => theme.blur.lg};
    border-bottom: 1px solid ${({ theme }) => theme.border.glass};
    padding: ${({ theme }) => theme.spacing.lg};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const NavItem = styled(motion(Link))`
  position: relative;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.text.secondary)};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.md};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
  transition: color ${({ theme }) => theme.transitions.fast};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.gradients.primary};
    opacity: ${({ $active }) => ($active ? 0.1 : 0)};
    transition: opacity ${({ theme }) => theme.transitions.normal};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ $active }) => ($active ? '80%' : '0')};
    height: 2px;
    background: ${({ theme }) => theme.gradients.primary};
    border-radius: ${({ theme }) => theme.radius.full};
    transition: width ${({ theme }) => theme.transitions.normal};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};

    &::before {
      opacity: 0.1;
    }

    &::after {
      width: 80%;
    }
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// Right Section
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SearchButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.background.glass};
  border: 1px solid ${({ theme }) => theme.border.glass};
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  min-width: 200px;

  &:hover {
    background: ${({ theme }) => theme.background.glassHover};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }

  svg {
    width: 16px;
    height: 16px;
  }

  kbd {
    padding: 2px 6px;
    background: ${({ theme }) => theme.background.tertiary};
    border-radius: ${({ theme }) => theme.radius.sm};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-family: ${({ theme }) => theme.fonts.mono};
  }

  @media (max-width: 768px) {
    min-width: auto;

    span,
    kbd {
      display: none;
    }
  }
`;

const NotificationButton = styled(motion.button)`
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background.glass};
  border: 1px solid ${({ theme }) => theme.border.glass};
  border-radius: ${({ theme }) => theme.radius.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme }) => theme.background.glassHover};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.text.secondary};
  }
`;

const NotificationBadge = styled(motion.div)`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: ${({ theme }) => theme.gradients.secondary};
  border: 2px solid ${({ theme }) => theme.background.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.neonPink};
`;

const NotificationPopover = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 0;
  width: 320px;
  max-height: 60vh;
  overflow: auto;
  background: ${({ theme }) => theme.background.glass};
  backdrop-filter: ${({ theme }) => theme.blur.lg};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.lg};
  border: 1px solid ${({ theme }) => theme.border.glass};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.md};
  z-index: ${({ theme }) => theme.zIndices.popover};
`;

const UserAvatar = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.gradients.cosmic};
  border: 2px solid ${({ theme }) => theme.border.glass};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.normal};
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.glow};

    &::before {
      opacity: 1;
    }
  }
`;

// Ripple Effect
const Ripple = styled(motion.span)`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  pointer-events: none;
`;

function NavigationBar({ onMenuToggle }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const isActive = path => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/projects', label: 'Projects', icon: ProjectIcon },
    { path: '/tasks', label: 'Tasks', icon: TaskIcon },
    { path: '/chat', label: 'Chat', icon: ChatIcon },
  ];

  const createRipple = event => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <NavContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <NavContent>
        {/* Logo Section */}
        <LogoSection>
          <Logo to="/">
            <LogoIcon whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
              📊
            </LogoIcon>
            <LogoText>Project Manager</LogoText>
          </Logo>

          <MenuToggle onClick={() => setMobileMenuOpen(!mobileMenuOpen)} whileTap={{ scale: 0.95 }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <>
                  <path d="M18 6L6 18M6 6l12 12" />
                </>
              ) : (
                <>
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </>
              )}
            </svg>
          </MenuToggle>

          {/* Mobile-only menu trigger to toggle sidebar if provided */}
          {onMenuToggle && (
            <MenuToggle onClick={onMenuToggle} whileTap={{ scale: 0.95 }}>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </MenuToggle>
          )}
        </LogoSection>

        {/* Main Menu */}
        <AnimatePresence>
          {(mobileMenuOpen || window.innerWidth > 768) && (
            <MainMenu
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {navItems.map(item => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  $active={isActive(item.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon />
                  {item.label}
                </NavItem>
              ))}
            </MainMenu>
          )}
        </AnimatePresence>

        {/* Right Section */}
        <RightSection>
          <SearchButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <SearchIcon />
            <span>Search...</span>
            <kbd>⌘K</kbd>
          </SearchButton>

          <div style={{ position: 'relative' }}>
            <NotificationButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={e => {
                createRipple(e);
                setNotifOpen(prev => !prev);
              }}
              aria-haspopup="dialog"
              aria-expanded={notifOpen}
            >
              <BellIcon />
              <NotificationBadge
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                3
              </NotificationBadge>
              {ripples.map(ripple => (
                <Ripple
                  key={ripple.id}
                  initial={{
                    x: ripple.x,
                    y: ripple.y,
                    width: ripple.size,
                    height: ripple.size,
                    opacity: 1,
                  }}
                  animate={{ opacity: 0, scale: 2 }}
                  transition={{ duration: 0.6 }}
                />
              ))}
            </NotificationButton>

            <AnimatePresence>
              {notifOpen && (
                <NotificationPopover
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <strong>Notifications</strong>
                    <button
                      onClick={() => setNotifOpen(false)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div
                    style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>New message in #general</span>
                      <Badge $variant="info">now</Badge>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>Task "Design header" completed</span>
                      <Badge $variant="success">2m</Badge>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>Project "Mobile App" moved to Planning</span>
                      <Badge $variant="warning">1h</Badge>
                    </div>
                  </div>
                </NotificationPopover>
              )}
            </AnimatePresence>
          </div>

          <ThemeToggle />

          <UserAvatar
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={createRipple}
          >
            JD
            {ripples.map(ripple => (
              <Ripple
                key={ripple.id}
                initial={{
                  x: ripple.x,
                  y: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                  opacity: 1,
                }}
                animate={{
                  opacity: 0,
                  scale: 2,
                }}
                transition={{ duration: 0.6 }}
              />
            ))}
          </UserAvatar>
        </RightSection>
      </NavContent>
    </NavContainer>
  );
}

// Icon Components
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </svg>
);

const ProjectIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const TaskIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export default NavigationBar;
