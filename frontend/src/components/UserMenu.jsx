// filepath: c:\Project_Manager\frontend\src\components\UserMenu.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';

const MenuButton = styled(motion.button)`
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

const Dropdown = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 0;
  width: 260px;
  background: ${({ theme }) => theme.background.glass};
  backdrop-filter: ${({ theme }) => theme.blur.lg};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.lg};
  border: 1px solid ${({ theme }) => theme.border.glass};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xxl};
  overflow: hidden;
  z-index: ${({ theme }) => theme.zIndices.popover};
`;

const UserInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.border.glass};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.gradients.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }

  .info {
    flex: 1;

    .name {
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
      color: ${({ theme }) => theme.text.primary};
      margin-bottom: ${({ theme }) => theme.spacing.xs};
    }

    .email {
      font-size: ${({ theme }) => theme.fontSizes.sm};
      color: ${({ theme }) => theme.text.tertiary};
    }
  }
`;

const MenuList = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
`;

const MenuItem = styled(motion(Link))`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  text-decoration: none;
  color: ${({ theme }) => theme.text.primary};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.border.glass};
  margin: ${({ theme }) => `${theme.spacing.sm} 0`};
`;

const LogoutButton = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.md};

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export default function UserMenu({
  user = { name: 'John Doe', email: 'john@example.com', initials: 'JD' },
}) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: UserIcon, label: 'Profile', to: '/profile' },
    { icon: SettingsIcon, label: 'Settings', to: '/settings' },
    { icon: BellIcon, label: 'Notifications', to: '/notifications' },
    { icon: HelpIcon, label: 'Help & Support', to: '/help' },
  ];

  const handleLogout = () => {
    authService.logout();
    setIsOpen(false);
    window.location.href = '/login';
  };

  return (
    <div style={{ position: 'relative' }}>
      <MenuButton
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {user.initials}
      </MenuButton>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1199,
              }}
              onClick={() => setIsOpen(false)}
            />
            <Dropdown
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <UserInfo>
                <div className="avatar">{user.initials}</div>
                <div className="info">
                  <div className="name">{user.name}</div>
                  <div className="email">{user.email}</div>
                </div>
              </UserInfo>

              <MenuList>
                {menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </MenuItem>
                ))}

                <Divider />

                <LogoutButton
                  onClick={handleLogout}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogoutIcon />
                  <span>Log out</span>
                </LogoutButton>
              </MenuList>
            </Dropdown>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Icon Components
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m6-12h-6m0 6H6" />
    <path d="M19.07 4.93l-4.24 4.24m0 5.66l4.24 4.24M4.93 4.93l4.24 4.24m0 5.66l-4.24 4.24" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <circle cx="12" cy="17" r=".5" fill="currentColor" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
