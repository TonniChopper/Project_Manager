import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Sidebar Container
const SidebarContainer = styled(motion.aside)`
  position: fixed;
  left: 0;
  top: 70px;
  bottom: 0;
  width: ${({ $isCollapsed }) => ($isCollapsed ? '80px' : '280px')};
  background: ${({ theme }) => theme.background.glass};
  backdrop-filter: ${({ theme }) => theme.blur.lg};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.lg};
  border-right: 1px solid ${({ theme }) => theme.border.glass};
  box-shadow: ${({ theme }) => theme.shadows.glass};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: width ${({ theme }) => theme.transitions.normal};
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    transform: translateX(${({ $isCollapsed }) => ($isCollapsed ? '-100%' : '0')});
    width: 280px;
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.radius.full};
  }
`;

// Toggle Button
const ToggleButton = styled(motion.button)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.lg};
  right: -16px;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.gradients.primary};
  border: 2px solid ${({ theme }) => theme.border.glass};
  box-shadow: ${({ theme }) => theme.shadows.glow};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.white};
    transition: transform ${({ theme }) => theme.transitions.normal};
    transform: rotate(${({ $isCollapsed }) => ($isCollapsed ? '180deg' : '0deg')});
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.glowLg};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// Section
const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled(motion.div)`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.text.tertiary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
  white-space: nowrap;
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition: opacity ${({ theme }) => theme.transitions.normal};
`;

// Menu Items
const MenuItem = styled(motion(Link))`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.text.secondary)};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.medium};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.gradients.primary};
    opacity: ${({ $active }) => ($active ? 0.15 : 0)};
    transition: opacity ${({ theme }) => theme.transitions.normal};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.background.glassHover};
    transform: translateX(4px);

    &::before {
      opacity: 0.1;
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

const MenuIcon = styled(motion.div)`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;

  svg {
    width: 20px;
    height: 20px;
  }

  ${({ $active, theme }) =>
    $active &&
    `
    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      background: ${theme.gradients.primary};
      border-radius: ${theme.radius.md};
      opacity: 0.2;
      filter: blur(8px);
    }
  `}
`;

const MenuLabel = styled(motion.span)`
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const MenuBadge = styled(motion.span)`
  padding: ${({ theme }) => `2px ${theme.spacing.sm}`};
  background: ${({ theme, $variant = 'primary' }) => {
    const variants = {
      primary: theme.colors.primary,
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
    };
    return variants[$variant];
  }};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: ${({ theme }) => theme.shadows.glow};
  min-width: 20px;
  text-align: center;
`;

// Floating Action Button
const FloatingButton = styled(motion.button)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.gradients.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.glow};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  position: relative;
  overflow: hidden;

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
    transition:
      width 0.6s,
      height 0.6s;
  }

  &:hover::before {
    width: 300px;
    height: 300px;
  }

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.glowLg};
  }

  svg {
    width: 20px;
    height: 20px;
    z-index: 1;
  }

  span {
    z-index: 1;
  }
`;

// Divider
const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.gradients.primary};
  margin: ${({ theme }) => theme.spacing.lg} 0;
  opacity: 0.3;
`;

// Projects List
const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ProjectItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.background.glassHover};
    transform: translateX(4px);
  }
`;

const ProjectColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $color }) => $color};
  box-shadow: 0 0 10px ${({ $color }) => $color};
  flex-shrink: 0;
`;

const ProjectName = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.text.secondary};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

function Sidebar({ isCollapsed, onToggle }) {
  const location = useLocation();
  const [projects] = useState([
    { id: 1, name: 'Website Redesign', color: '#7c3aed' },
    { id: 2, name: 'Mobile App', color: '#ec4899' },
    { id: 3, name: 'Marketing Campaign', color: '#06b6d4' },
    { id: 4, name: 'Product Launch', color: '#10b981' },
  ]);

  const isActive = path => location.pathname === path;

  const mainMenuItems = [
    {
      path: '/projects',
      label: 'Projects',
      icon: ProjectIcon,
      badge: { count: 12, variant: 'primary' },
    },
    {
      path: '/tasks',
      label: 'Tasks',
      icon: TaskIcon,
      badge: { count: 5, variant: 'warning' },
    },
    {
      path: '/chat',
      label: 'Chat',
      icon: ChatIcon,
      badge: { count: 3, variant: 'success' },
    },
    {
      path: '/calendar',
      label: 'Calendar',
      icon: CalendarIcon,
    },
  ];

  const toolsMenuItems = [
    { path: '/analytics', label: 'Analytics', icon: AnalyticsIcon },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  return (
    <SidebarContainer
      $isCollapsed={isCollapsed}
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <ToggleButton
        onClick={onToggle}
        $isCollapsed={isCollapsed}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </ToggleButton>

      <SidebarContent>
        {/* New Project Button */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <FloatingButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <PlusIcon />
                <span>New Project</span>
              </FloatingButton>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Menu */}
        <Section>
          <SectionTitle $isCollapsed={isCollapsed}>Menu</SectionTitle>
          {mainMenuItems.map((item, index) => (
            <MenuItem
              key={item.path}
              to={item.path}
              $active={isActive(item.path)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
            >
              <MenuIcon $active={isActive(item.path)}>
                <item.icon />
              </MenuIcon>
              <AnimatePresence>
                {!isCollapsed && (
                  <MenuLabel
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.label}
                  </MenuLabel>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {!isCollapsed && item.badge && (
                  <MenuBadge
                    $variant={item.badge.variant}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {item.badge.count}
                  </MenuBadge>
                )}
              </AnimatePresence>
            </MenuItem>
          ))}
        </Section>

        {/* Projects */}
        <AnimatePresence>
          {!isCollapsed && (
            <Section
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SectionTitle $isCollapsed={isCollapsed}>Projects</SectionTitle>
              <ProjectsList>
                {projects.map((project, index) => (
                  <ProjectItem
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <ProjectColor $color={project.color} />
                    <ProjectName>{project.name}</ProjectName>
                  </ProjectItem>
                ))}
              </ProjectsList>
            </Section>
          )}
        </AnimatePresence>

        <Divider />

        {/* Tools */}
        <Section>
          <SectionTitle $isCollapsed={isCollapsed}>Tools</SectionTitle>
          {toolsMenuItems.map((item, index) => (
            <MenuItem
              key={item.path}
              to={item.path}
              $active={isActive(item.path)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
            >
              <MenuIcon $active={isActive(item.path)}>
                <item.icon />
              </MenuIcon>
              <AnimatePresence>
                {!isCollapsed && (
                  <MenuLabel
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.label}
                  </MenuLabel>
                )}
              </AnimatePresence>
            </MenuItem>
          ))}
        </Section>
      </SidebarContent>
    </SidebarContainer>
  );
}

// Icon Components
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

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 20V10M12 20V4M6 20v-6" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m-9-9h6m6 0h6" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default Sidebar;
