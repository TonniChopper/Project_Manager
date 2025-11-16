import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  GlassCard,
  GradientCard,
  NeonButton,
  GlassButton,
  GradientText,
  Badge,
  GradientDivider,
  SkeletonLoader,
} from '../theme';

const ShowcaseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxl};
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const BadgeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Hero = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing.xxxl} 0`};
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxxxl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

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

const ThemeShowcase = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <ShowcaseWrapper>
      {/* Hero Section */}
      <Hero>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>
            <GradientText $gradient="cosmic">Eye-Catching Theme Showcase</GradientText>
          </HeroTitle>
          <HeroSubtitle>
            Explore our stunning visual components with glassmorphism, gradients, and neon effects
          </HeroSubtitle>
        </motion.div>
      </Hero>

      {/* Buttons Section */}
      <Section>
        <SectionTitle>
          <GradientText>Neon Buttons</GradientText>
        </SectionTitle>
        <ButtonGroup>
          <NeonButton $variant="primary" $size="sm">
            Primary Small
          </NeonButton>
          <NeonButton $variant="primary" $size="md">
            Primary Medium
          </NeonButton>
          <NeonButton $variant="primary" $size="lg">
            Primary Large
          </NeonButton>
          <NeonButton $variant="secondary" $size="md">
            Secondary
          </NeonButton>
          <NeonButton $variant="accent" $size="md">
            Accent
          </NeonButton>
          <NeonButton $variant="gradient" $size="md">
            Gradient
          </NeonButton>
        </ButtonGroup>

        <GradientDivider $gradient="aurora" />

        <ButtonGroup>
          <GlassButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Glass Button
          </GlassButton>
          <GlassButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Another Glass
          </GlassButton>
        </ButtonGroup>
      </Section>

      {/* Cards Section */}
      <Section>
        <SectionTitle>
          <GradientText $gradient="ocean">Glass Cards</GradientText>
        </SectionTitle>
        <Grid>
          {[0, 1, 2].map(i => (
            <GlassCard
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
            >
              <h3 style={{ marginBottom: '1rem' }}>Glass Card {i + 1}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Beautiful glassmorphism effect with backdrop blur and smooth animations. Hover to
                see the magic!
              </p>
            </GlassCard>
          ))}
        </Grid>
      </Section>

      {/* Gradient Cards Section */}
      <Section>
        <SectionTitle>
          <GradientText $gradient="sunset">Gradient Cards</GradientText>
        </SectionTitle>
        <Grid>
          <GradientCard $gradient="primary" whileHover={{ scale: 1.05, rotate: 1 }}>
            <h3 style={{ marginBottom: '1rem' }}>Primary Gradient</h3>
            <p>Vibrant purple gradient with animated overlay effect</p>
          </GradientCard>
          <GradientCard $gradient="cosmic" whileHover={{ scale: 1.05, rotate: -1 }}>
            <h3 style={{ marginBottom: '1rem' }}>Cosmic Gradient</h3>
            <p>Stunning pink to yellow gradient combination</p>
          </GradientCard>
          <GradientCard $gradient="ocean" whileHover={{ scale: 1.05, rotate: 1 }}>
            <h3 style={{ marginBottom: '1rem' }}>Ocean Gradient</h3>
            <p>Calm and soothing ocean-inspired colors</p>
          </GradientCard>
        </Grid>
      </Section>

      {/* Badges Section */}
      <Section>
        <SectionTitle>
          <GradientText $gradient="neon">Status Badges</GradientText>
        </SectionTitle>
        <BadgeGroup>
          <Badge $variant="primary">Primary</Badge>
          <Badge $variant="secondary">Secondary</Badge>
          <Badge $variant="success">Success</Badge>
          <Badge $variant="warning">Warning</Badge>
          <Badge $variant="error">Error</Badge>
          <Badge $variant="info">Info</Badge>
          <Badge $variant="primary" $glow>
            Glowing
          </Badge>
        </BadgeGroup>
      </Section>

      {/* Gradient Text Section */}
      <Section>
        <SectionTitle>
          <GradientText $gradient="aurora">Gradient Text</GradientText>
        </SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2>
            <GradientText $gradient="primary">This is Primary Gradient Text</GradientText>
          </h2>
          <h2>
            <GradientText $gradient="cosmic">This is Cosmic Gradient Text</GradientText>
          </h2>
          <h2>
            <GradientText $gradient="sunset">This is Sunset Gradient Text</GradientText>
          </h2>
          <h2>
            <GradientText $gradient="neon">This is Neon Gradient Text</GradientText>
          </h2>
        </div>
      </Section>

      {/* Loading Skeletons */}
      <Section>
        <SectionTitle>
          <GradientText>Loading Skeletons</GradientText>
        </SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SkeletonLoader $height="40px" />
          <SkeletonLoader $height="20px" $width="80%" />
          <SkeletonLoader $height="20px" $width="60%" />
          <SkeletonLoader $height="100px" $radius="xl" />
        </div>
      </Section>

      {/* Dividers */}
      <Section>
        <SectionTitle>
          <GradientText>Gradient Dividers</GradientText>
        </SectionTitle>
        <GradientDivider $gradient="primary" />
        <GradientDivider $gradient="secondary" />
        <GradientDivider $gradient="cosmic" />
        <GradientDivider $gradient="aurora" />
      </Section>
    </ShowcaseWrapper>
  );
};

export default ThemeShowcase;
