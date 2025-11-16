import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.sticky};
  background: ${({ theme }) => theme.background.glass};
  backdrop-filter: ${({ theme }) => theme.blur.lg};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.lg};
  border-bottom: 1px solid ${({ theme }) => theme.border.glass};
  box-shadow: ${({ theme }) => theme.shadows.glass};
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.text.primary};
  text-decoration: none;
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.05);
  }
`;

const LogoIcon = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  filter: drop-shadow(0 0 10px ${({ theme }) => theme.colors.primaryGlow});
`;

const LogoText = styled.span`
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
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  position: relative;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.text.secondary)};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.medium};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &::before {
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
      width: 80%;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ProfileButton = styled(motion.button)`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.background.glass};
  backdrop-filter: ${({ theme }) => theme.blur.md};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.md};
  border: 1px solid ${({ theme }) => theme.border.glass};
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.text.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme }) => theme.background.glassHover};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing.xxl} 0`};
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const Footer = styled.footer`
  background: ${({ theme }) => theme.background.glass};
  backdrop-filter: ${({ theme }) => theme.blur.md};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.md};
  border-top: 1px solid ${({ theme }) => theme.border.glass};
  padding: ${({ theme }) => `${theme.spacing.xl} 0`};
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

function Layout({ children }) {
  const location = useLocation();
  const isActive = path => location.pathname === path;

  return (
    <LayoutWrapper>
      <Header>
        <HeaderContent>
          <Logo to="/">
            <LogoIcon>📊</LogoIcon>
            <LogoText>Project Manager</LogoText>
          </Logo>

          <Nav>
            <NavLink to="/" $active={isActive('/')}>
              Home
            </NavLink>
            <NavLink to="/projects" $active={isActive('/projects')}>
              Projects
            </NavLink>
            <NavLink to="/tasks" $active={isActive('/tasks')}>
              Tasks
            </NavLink>
            <NavLink to="/chat" $active={isActive('/chat')}>
              Chat
            </NavLink>
          </Nav>

          <HeaderActions>
            <ThemeToggle />
            <ProfileButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Profile
            </ProfileButton>
          </HeaderActions>
        </HeaderContent>
      </Header>

      <Main>
        <Container>{children}</Container>
      </Main>

      <Footer>
        <FooterContent>
          <p>&copy; 2025 Project Manager. All rights reserved.</p>
        </FooterContent>
      </Footer>
    </LayoutWrapper>
  );
}

export default Layout;
