import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GlassCard, GradientCard, GradientText, Badge, GradientDivider } from '../theme';

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxxl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxxxl};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.xxxl};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.text.secondary};
  max-width: 600px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FeatureCard = styled(GlassCard)`
  h3 {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
  }

  p {
    color: ${({ theme }) => theme.text.secondary};
    line-height: ${({ theme }) => theme.lineHeights.relaxed};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      padding: ${({ theme }) => theme.spacing.sm} 0;
      color: ${({ theme }) => theme.text.secondary};
      display: flex;
      align-items: center;
      gap: ${({ theme }) => theme.spacing.sm};

      &::before {
        content: '✓';
        color: ${({ theme }) => theme.colors.success};
        font-weight: bold;
      }
    }
  }
`;

const DemoSection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xxxl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const KeyboardShortcuts = styled(GradientCard)`
  .shortcut-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  }

  .shortcut-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.sm};
    background: rgba(255, 255, 255, 0.1);
    border-radius: ${({ theme }) => theme.radius.md};

    .label {
      font-size: ${({ theme }) => theme.fontSizes.sm};
    }

    .keys {
      display: flex;
      gap: ${({ theme }) => theme.spacing.xs};

      kbd {
        padding: ${({ theme }) => `2px ${theme.spacing.sm}`};
        background: rgba(0, 0, 0, 0.3);
        border-radius: ${({ theme }) => theme.radius.sm};
        font-size: ${({ theme }) => theme.fontSizes.xs};
        font-family: ${({ theme }) => theme.fonts.mono};
        color: ${({ theme }) => theme.colors.white};
      }
    }
  }
`;

function NavigationDemo() {
  const features = [
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description:
        'Glassmorphism with frosted glass effects, gradient backgrounds, and neon glows.',
      items: [
        'Animated logo with gradient text',
        'Hover ripple effects on buttons',
        'Smooth transitions and animations',
        'Glass panel with backdrop blur',
      ],
    },
    {
      icon: '📱',
      title: 'Responsive Sidebar',
      description: 'Collapsible sidebar with rich visual elements and smooth animations.',
      items: [
        'Toggle between expanded/collapsed',
        'Project list with color indicators',
        'Badge notifications',
        'Mobile-friendly with overlay',
      ],
    },
    {
      icon: '⚡',
      title: 'Interactive Elements',
      description: 'Engaging micro-interactions that delight users.',
      items: [
        'Floating action button',
        'Icon animations on hover',
        'Pop animations on navigation',
        'Search with keyboard shortcut',
      ],
    },
  ];

  const shortcuts = [
    { label: 'Search', keys: ['⌘', 'K'] },
    { label: 'Toggle Sidebar', keys: ['⌘', 'B'] },
    { label: 'New Project', keys: ['⌘', 'N'] },
    { label: 'Settings', keys: ['⌘', ','] },
  ];

  return (
    <PageWrapper>
      <Hero>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title>
            <GradientText $gradient="cosmic">✨ Beautiful Navigation & Sidebar</GradientText>
          </Title>
          <Subtitle>
            Experience stunning, animated navigation inspired by Notion, Linear, and modern web
            apps. Try collapsing the sidebar and exploring the interactive elements!
          </Subtitle>
        </motion.div>
      </Hero>

      <DemoSection>
        <SectionTitle>
          <GradientText $gradient="primary">Key Features</GradientText>
        </SectionTitle>
        <Grid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <h3>
                <span style={{ fontSize: '2rem' }}>{feature.icon}</span>
                {feature.title}
              </h3>
              <p>{feature.description}</p>
              <ul>
                {feature.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </FeatureCard>
          ))}
        </Grid>
      </DemoSection>

      <GradientDivider $gradient="aurora" />

      <DemoSection>
        <SectionTitle>
          <GradientText $gradient="sunset">Navigation Bar Components</GradientText>
        </SectionTitle>
        <Grid>
          <GlassCard as={motion.div} whileHover={{ y: -4 }}>
            <h3>
              <Badge $variant="primary">Logo</Badge>
            </h3>
            <p>
              Animated logo with gradient text effect. Hover to see scale and rotation animations.
              The icon features a subtle glow effect that pulses on interaction.
            </p>
          </GlassCard>

          <GlassCard as={motion.div} whileHover={{ y: -4 }}>
            <h3>
              <Badge $variant="secondary">Search</Badge>
            </h3>
            <p>
              Quick search bar with keyboard shortcut (⌘K). Glass effect with focus state that shows
              neon border glow. Type to search across projects, tasks, and messages.
            </p>
          </GlassCard>

          <GlassCard as={motion.div} whileHover={{ y: -4 }}>
            <h3>
              <Badge $variant="success">Notifications</Badge>
            </h3>
            <p>
              Bell icon with animated badge showing unread count. Ripple effect on click. Real-time
              updates for new messages, task assignments, and mentions.
            </p>
          </GlassCard>

          <GlassCard as={motion.div} whileHover={{ y: -4 }}>
            <h3>
              <Badge $variant="info">User Avatar</Badge>
            </h3>
            <p>
              Gradient avatar with initials. Hover reveals overlay effect. Click to access user menu
              with profile settings, preferences, and logout options.
            </p>
          </GlassCard>
        </Grid>
      </DemoSection>

      <GradientDivider $gradient="ocean" />

      <DemoSection>
        <SectionTitle>
          <GradientText $gradient="neon">Sidebar Features</GradientText>
        </SectionTitle>
        <Grid>
          <GlassCard as={motion.div} whileHover={{ y: -4 }}>
            <h3>
              <Badge $variant="warning">Collapsible</Badge>
            </h3>
            <p>
              Toggle between expanded and collapsed states. Icons remain visible when collapsed.
              Smooth width transition with menu labels fading in/out elegantly.
            </p>
          </GlassCard>

          <GlassCard as={motion.div} whileHover={{ y: -4 }}>
            <h3>
              <Badge $variant="error">Projects List</Badge>
            </h3>
            <p>
              Quick access to your active projects with color-coded indicators. Each project has a
              unique color that glows on hover for easy visual identification.
            </p>
          </GlassCard>

          <GlassCard as={motion.div} whileHover={{ y: -4 }}>
            <h3>
              <Badge $variant="primary" $glow>
                New Project Button
              </Badge>
            </h3>
            <p>
              Floating gradient button with ripple effect. Creates new projects instantly. Features
              wave animation on hover for engaging interaction.
            </p>
          </GlassCard>
        </Grid>
      </DemoSection>

      <GradientDivider $gradient="cosmic" />

      <DemoSection>
        <SectionTitle>
          <GradientText $gradient="aurora">Keyboard Shortcuts</GradientText>
        </SectionTitle>
        <KeyboardShortcuts
          $gradient="primary"
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>⌨️ Speed Up Your Workflow</h3>
          <div className="shortcut-list">
            {shortcuts.map((shortcut, index) => (
              <motion.div
                key={index}
                className="shortcut-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <span className="label">{shortcut.label}</span>
                <div className="keys">
                  {shortcut.keys.map((key, i) => (
                    <kbd key={i}>{key}</kbd>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </KeyboardShortcuts>
      </DemoSection>

      <DemoSection style={{ textAlign: 'center' }}>
        <GlassCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3>
            <GradientText $gradient="neon">🚀 Ready to Explore?</GradientText>
          </h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Try collapsing the sidebar using the toggle button. Click on different navigation items
            to see smooth page transitions. Hover over elements to discover delightful
            micro-interactions!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Badge $variant="primary" $glow>
              Glassmorphism
            </Badge>
            <Badge $variant="secondary" $glow>
              Animations
            </Badge>
            <Badge $variant="success" $glow>
              Gradients
            </Badge>
            <Badge $variant="info" $glow>
              Neon Effects
            </Badge>
          </div>
        </GlassCard>
      </DemoSection>
    </PageWrapper>
  );
}

export default NavigationDemo;
