// filepath: c:\Project_Manager\frontend\src\pages\Dashboard.js
import React, { useState, useEffect } from 'react';
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
import projectService from '../services/projectService';

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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [projectsData] = await Promise.all([projectService.getProjects({ limit: 6, include: 'metrics' })]);
      const transformedProjects = projectsData.map(p => ({
        id: p.id,
        name: p.name,
        status: p.status || 'active',
        progress: p.metrics ? p.metrics.progress_percent : 0,
        totalTasks: p.metrics ? p.metrics.total_tasks : 0,
        completedTasks: p.metrics ? p.metrics.completed_tasks : 0,
        velocity7d: p.metrics ? p.metrics.velocity_7d : 0,
        overdue: p.metrics ? p.metrics.overdue_tasks : 0,
        color: getStatusColor(p.status),
      }));
      setProjects(transformedProjects);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = project => {
    return project.progress || 0; // теперь берем из backend
  };

  const getStatusColor = status => {
    const colors = {
      active: 'primary',
      planning: 'secondary',
      review: 'accent',
      completed: 'success',
      on_hold: 'warning',
    };
    return colors[status] || 'primary';
  };

  if (loading) {
    return (
      <DashboardWrapper>
        <HeaderRow>
          <Title>
            <GradientText>Dashboard</GradientText>
          </Title>
        </HeaderRow>
        <Grid>
          {[1, 2, 3, 4].map(i => (
            <GlassCard key={i}>
              <SkeletonLoader $height="100px" />
            </GlassCard>
          ))}
        </Grid>
      </DashboardWrapper>
    );
  }

  if (error) {
    return (
      <DashboardWrapper>
        <HeaderRow>
          <Title>
            <GradientText>Dashboard</GradientText>
          </Title>
        </HeaderRow>
        <GlassCard>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--error)' }}>Failed to load dashboard data</p>
            <NeonButton onClick={loadDashboardData}>Retry</NeonButton>
          </div>
        </GlassCard>
      </DashboardWrapper>
    );
  }

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
            >
              <div className="header">
                <div className="title">{p.name}</div>
                <Badge $variant={p.color}>{p.status}</Badge>
              </div>
              <div className="meta">
                <span>{p.completedTasks}/{p.totalTasks} tasks</span>
                <span>Velocity(7d): {p.velocity7d}</span>
                {p.overdue > 0 && <span style={{ color: 'var(--error)' }}>Overdue: {p.overdue}</span>}
              </div>
              <ProgressBar>
                <div className="fill" style={{ width: `${calculateProgress(p)}%` }} />
              </ProgressBar>
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
