import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  padding-top: 70px;
`;

const MainContent = styled(motion.main)`
  flex: 1;
  margin-left: ${({ $sidebarCollapsed }) => ($sidebarCollapsed ? '80px' : '280px')};
  padding: ${({ theme }) => `${theme.spacing.xxl} ${theme.spacing.xl}`};
  transition: margin-left ${({ theme }) => theme.transitions.normal};
  min-height: calc(100vh - 70px);

  @media (max-width: 768px) {
    margin-left: 0;
    padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.md}`};
  }
`;

const MobileOverlay = styled(motion.div)`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: ${({ theme }) => theme.zIndices.overlay};
  }
`;

function AppLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <LayoutWrapper>
      <NavigationBar onMenuToggle={handleSidebarToggle} />

      <ContentWrapper>
        <Sidebar
          isCollapsed={window.innerWidth <= 768 ? !mobileSidebarOpen : sidebarCollapsed}
          onToggle={handleSidebarToggle}
        />

        {mobileSidebarOpen && window.innerWidth <= 768 && (
          <MobileOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <MainContent
          $sidebarCollapsed={sidebarCollapsed}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {children}
        </MainContent>
      </ContentWrapper>
    </LayoutWrapper>
  );
}

export default AppLayout;
