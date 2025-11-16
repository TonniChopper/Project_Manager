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
} from '../theme';

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxl};
`;

const Hero = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing.xxxl} 0`};
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxxxl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.xxxl};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.text.secondary};
  max-width: 600px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled(GlassCard)`
  text-align: center;
  
  h3 {
    font-size: ${({ theme }) => theme.fontSizes.xxxl};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  p {
    color: ${({ theme }) => theme.text.secondary};
    font-size: ${({ theme }) => theme.fontSizes.md};
    margin: 0;
  }
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const ActionCard = styled(GradientCard)`
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  gap: ${({ theme }) => theme.spacing.md};
  
  .icon {
    font-size: ${({ theme }) => theme.fontSizes.xxxxl};
  }
  
  .title {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    margin: 0;
  }
`;

const ActivitySection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActivityItem = styled(GlassCard)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .left {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
  }
  
  .icon {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
  }
  
  .content {
    h4 {
      margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
      font-size: ${({ theme }) => theme.fontSizes.md};
    }
    
    p {
      margin: 0;
      color: ${({ theme }) => theme.text.secondary};
      font-size: ${({ theme }) => theme.fontSizes.sm};
    }
  }
  
  .time {
    color: ${({ theme }) => theme.text.tertiary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing.xxxl} 0`};
  color: ${({ theme }) => theme.text.secondary};
  
  .icon {
    font-size: 64px;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    opacity: 0.5;
  }
  
  p {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

function Home() {
  const stats = [
    { label: 'Active Projects', value: '0', gradient: 'primary' },
    { label: 'Tasks Completed', value: '0', gradient: 'success' },
    { label: 'Team Members', value: '0', gradient: 'cosmic' },
    { label: 'Messages', value: '0', gradient: 'sunset' },
  ];

  const quickActions = [
    { icon: '📋', title: 'Create Project', gradient: 'primary' },
    { icon: '✓', title: 'Add Task', gradient: 'success' },
    { icon: '💬', title: 'Open Chat', gradient: 'cosmic' },
    { icon: '👥', title: 'Invite Team', gradient: 'sunset' },
  ];

  const recentActivity = [
    // Example data - would come from API
    // { icon: '📋', title: 'Project created', description: 'New project "Website Redesign" was created', time: '2 hours ago', type: 'project' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <HomeWrapper>
      {/* Hero Section */}
      <Hero>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>
            <GradientText $gradient="cosmic">
              Welcome to Project Manager
            </GradientText>
          </HeroTitle>
          <HeroSubtitle>
            Your AI-powered workspace for managing projects, tasks, and team collaboration
          </HeroSubtitle>
        </motion.div>
      </Hero>

      {/* Stats Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              as={motion.div}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <h3>
                <GradientText $gradient={stat.gradient}>
                  {stat.value}
                </GradientText>
              </h3>
              <p>{stat.label}</p>
            </StatCard>
          ))}
        </StatsGrid>
      </motion.div>

      <GradientDivider $gradient="aurora" />

      {/* Quick Actions */}
      <div>
        <h2 style={{ marginBottom: '1.5rem' }}>
          <GradientText>Quick Actions</GradientText>
        </h2>
        <ActionsGrid>
          {quickActions.map((action, index) => (
            <ActionCard
              key={index}
              $gradient={action.gradient}
              as={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="icon">{action.icon}</span>
              <h3 className="title">{action.title}</h3>
            </ActionCard>
          ))}
        </ActionsGrid>
      </div>

      <GradientDivider $gradient="ocean" />

      {/* Recent Activity */}
      <ActivitySection>
        <h2 style={{ marginBottom: '1.5rem' }}>
          <GradientText $gradient="neon">Recent Activity</GradientText>
        </h2>

        {recentActivity.length === 0 ? (
          <EmptyState>
            <div className="icon">📊</div>
            <p>No recent activity yet. Start by creating a project!</p>
            <ButtonGroup>
              <NeonButton $variant="primary" $size="lg">
                Create Project
              </NeonButton>
              <NeonButton $variant="secondary" $size="lg">
                Learn More
              </NeonButton>
            </ButtonGroup>
          </EmptyState>
        ) : (
          <ActivityList>
            {recentActivity.map((activity, index) => (
              <ActivityItem
                key={index}
                as={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="left">
                  <span className="icon">{activity.icon}</span>
                  <div className="content">
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                  </div>
                </div>
                <div className="right">
                  <Badge $variant={activity.type === 'project' ? 'primary' : 'success'}>
                    {activity.type}
                  </Badge>
                  <span className="time">{activity.time}</span>
                </div>
              </ActivityItem>
            ))}
          </ActivityList>
        )}
      </ActivitySection>
    </HomeWrapper>
  );
}

export default Home;

