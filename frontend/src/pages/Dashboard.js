// filepath: c:\Project_Manager\frontend\src\pages\Dashboard.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  GlassCard,
  GradientCard,
  NeonButton,
  GradientText,
  Badge,
  GradientDivider,
  SkeletonLoader,
} from '../theme';

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxl};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ProjectCard = styled(GlassCard)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
  }

  .meta {
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: center;
    color: ${({ theme }) => theme.text.tertiary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.full};
  overflow: hidden;

  .fill {
    height: 100%;
    background: ${({ theme }) => theme.gradients.primary};
  }
`;

const Masonry = styled.div`
  column-count: 3;
  column-gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1200px) {
    column-count: 2;
  }
  @media (max-width: 768px) {
    column-count: 1;
  }

  .masonry-item {
    break-inside: avoid;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const NotificationPanel = styled(GlassCard)`
  position: fixed;
  top: 80px;
  right: 32px;
  width: 360px;
  max-height: 70vh;
  overflow: auto;
`;

const Placeholder = styled(GlassCard)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  color: ${({ theme }) => theme.text.secondary};
`;

function Dashboard() {
  // Placeholder data; later will be fed by WebSocket updates
  const projects = [
    { id: 1, name: 'Website Redesign', status: 'In Progress', progress: 42, color: 'primary' },
    { id: 2, name: 'Mobile App', status: 'Planning', progress: 10, color: 'secondary' },
    { id: 3, name: 'AI Research', status: 'Review', progress: 65, color: 'accent' },
    { id: 4, name: 'Marketing Launch', status: 'Blocked', progress: 5, color: 'warning' },
  ];

  const notifications = [
    { id: 101, type: 'message', text: 'New comment in Website Redesign', time: '2m ago' },
    { id: 102, type: 'task', text: 'Task "Write tests" completed', time: '15m ago' },
    { id: 103, type: 'status', text: 'Mobile App moved to Planning', time: '1h ago' },
  ];

  return (
    <DashboardWrapper>
      <HeaderRow>
        <Title>
          <GradientText>Dashboard</GradientText>
        </Title>
        <Actions>
          <NeonButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            + New Project
          </NeonButton>
          <NeonButton $variant="secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            + New Task
          </NeonButton>
        </Actions>
      </HeaderRow>

      <GradientDivider $gradient="mesh" />

      {/* Masonry Project Cards */}
      <Masonry>
        {projects.map((p, i) => (
          <div className="masonry-item" key={p.id}>
            <ProjectCard
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <div className="header">
                <span className="title">{p.name}</span>
                <Badge $variant={p.color}>{p.status}</Badge>
              </div>
              <ProgressBar>
                <motion.div
                  className="fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${p.progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </ProgressBar>
              <div className="meta">
                <span>{p.progress}%</span>
                <span>•</span>
                <span>12 tasks</span>
              </div>
            </ProjectCard>
          </div>
        ))}
      </Masonry>

      {/* Quick create area */}
      <Grid>
        <GradientCard as={motion.div} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <h3>Quick Create</h3>
          <p style={{ opacity: 0.8 }}>Draft new items with one click</p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <NeonButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              + Project
            </NeonButton>
            <NeonButton
              $variant="secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + Task
            </NeonButton>
            <NeonButton $variant="accent" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              + Message
            </NeonButton>
          </div>
        </GradientCard>

        <Placeholder>
          <div style={{ width: '100%' }}>
            <div style={{ marginBottom: '0.5rem' }}>Live Feed</div>
            <SkeletonLoader $height="10px" $width="80%" />
            <SkeletonLoader $height="10px" $width="60%" style={{ marginTop: '8px' }} />
            <SkeletonLoader $height="10px" $width="70%" style={{ marginTop: '8px' }} />
          </div>
        </Placeholder>
      </Grid>

      {/* Notification Panel Example */}
      <NotificationPanel
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Notifications</h3>
          <Badge $variant="info">{notifications.length}</Badge>
        </div>
        <GradientDivider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map(n => (
            <GlassCard key={n.id} as={motion.div} whileHover={{ scale: 1.01 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{n.text}</span>
                <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>{n.time}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </NotificationPanel>
    </DashboardWrapper>
  );
}

export default Dashboard;
