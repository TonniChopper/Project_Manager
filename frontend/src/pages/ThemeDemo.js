import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GlassCard,
  GradientCard,
  NeonButton,
  GlassButton,
  GradientText,
  Badge,
  GlassInput,
  GradientDivider,
  SkeletonLoader,
  FloatingActionButton,
} from '../theme';

const DemoWrapper = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xxl};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xxxl};
`;

const SectionHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxxxl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.text.secondary};
  max-width: 800px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${({ $minWidth = '300px' }) => $minWidth}, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: ${({ $justify = 'flex-start' }) => $justify};
  align-items: ${({ $align = 'flex-start' }) => $align};
`;

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.background.tertiary};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow-x: auto;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border.light};
`;

const DemoCard = styled(GlassCard)`
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
  
  p {
    color: ${({ theme }) => theme.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const InteractiveDemo = styled(GlassCard)`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Counter = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xxxxl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: left;
  
  label {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.text.primary};
  }
`;

function ThemeDemo() {
  const [count, setCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const gradients = ['primary', 'cosmic', 'ocean', 'sunset', 'aurora', 'neon'];
  const buttonVariants = ['primary', 'secondary', 'accent', 'gradient'];
  const badgeVariants = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];

  return (
    <DemoWrapper>
      {/* Hero Section */}
      <Section>
        <SectionHeader>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title>
              <GradientText $gradient="cosmic">
                🎨 Theme System Demo
              </GradientText>
            </Title>
            <Subtitle>
              Explore our stunning visual components with glassmorphism, vibrant gradients, and smooth animations.
              Try interacting with the elements below!
            </Subtitle>
          </motion.div>
        </SectionHeader>
      </Section>

      <GradientDivider $gradient="aurora" />

      {/* Gradient Cards */}
      <Section>
        <h2 style={{ marginBottom: '1.5rem' }}>
          <GradientText>Gradient Cards</GradientText>
        </h2>
        <Grid>
          {gradients.map((gradient, index) => (
            <GradientCard
              key={gradient}
              $gradient={gradient}
              as={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
            >
              <h3>{gradient.charAt(0).toUpperCase() + gradient.slice(1)}</h3>
              <p>Beautiful {gradient} gradient with hover animation</p>
            </GradientCard>
          ))}
        </Grid>
      </Section>

      <GradientDivider $gradient="ocean" />

      {/* Glass Cards */}
      <Section>
        <h2 style={{ marginBottom: '1.5rem' }}>
          <GradientText $gradient="sunset">Glass Cards</GradientText>
        </h2>
        <Grid>
          {[1, 2, 3].map((num) => (
            <DemoCard
              key={num}
              as={motion.div}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h3>Glass Card {num}</h3>
              <p>
                Featuring glassmorphism with backdrop blur. Hover to see the smooth lift effect!
              </p>
              <FlexContainer>
                <Badge $variant="primary">Tag 1</Badge>
                <Badge $variant="success">Tag 2</Badge>
              </FlexContainer>
            </DemoCard>
          ))}
        </Grid>
      </Section>

      <GradientDivider $gradient="neon" />

      {/* Buttons */}
      <Section>
        <h2 style={{ marginBottom: '1.5rem' }}>
          <GradientText $gradient="primary">Neon Buttons</GradientText>
        </h2>
        <DemoCard>
          <h3>Button Variants</h3>
          <p>Glowing buttons with ripple effects on click</p>
          <FlexContainer $justify="center">
            {buttonVariants.map((variant) => (
              <NeonButton key={variant} $variant={variant} $size="md">
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </NeonButton>
            ))}
          </FlexContainer>

          <h3 style={{ marginTop: '2rem' }}>Button Sizes</h3>
          <FlexContainer $justify="center" $align="center">
            <NeonButton $variant="primary" $size="sm">Small</NeonButton>
            <NeonButton $variant="primary" $size="md">Medium</NeonButton>
            <NeonButton $variant="primary" $size="lg">Large</NeonButton>
          </FlexContainer>

          <h3 style={{ marginTop: '2rem' }}>Glass Buttons</h3>
          <FlexContainer $justify="center">
            <GlassButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Glass Button 1
            </GlassButton>
            <GlassButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Glass Button 2
            </GlassButton>
          </FlexContainer>
        </DemoCard>
      </Section>

      <GradientDivider $gradient="cosmic" />

      {/* Badges */}
      <Section>
        <h2 style={{ marginBottom: '1.5rem' }}>
          <GradientText $gradient="neon">Status Badges</GradientText>
        </h2>
        <DemoCard>
          <h3>Badge Variants</h3>
          <FlexContainer $justify="center">
            {badgeVariants.map((variant) => (
              <Badge key={variant} $variant={variant}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Badge>
            ))}
          </FlexContainer>

          <h3 style={{ marginTop: '2rem' }}>Glowing Badges</h3>
          <FlexContainer $justify="center">
            <Badge $variant="primary" $glow>Pulsing</Badge>
            <Badge $variant="secondary" $glow>Animated</Badge>
            <Badge $variant="success" $glow>Glowing</Badge>
          </FlexContainer>
        </DemoCard>
      </Section>

      <GradientDivider $gradient="sunset" />

      {/* Interactive Demo */}
      <Section>
        <h2 style={{ marginBottom: '1.5rem' }}>
          <GradientText $gradient="aurora">Interactive Counter</GradientText>
        </h2>
        <InteractiveDemo>
          <h3>Click the buttons to change the counter</h3>
          <Counter>
            <GradientText $gradient="cosmic">
              {count}
            </GradientText>
          </Counter>
          <FlexContainer $justify="center">
            <NeonButton
              $variant="accent"
              $size="lg"
              onClick={() => setCount(count - 1)}
            >
              Decrease
            </NeonButton>
            <NeonButton
              $variant="primary"
              $size="lg"
              onClick={() => setCount(0)}
            >
              Reset
            </NeonButton>
            <NeonButton
              $variant="secondary"
              $size="lg"
              onClick={() => setCount(count + 1)}
            >
              Increase
            </NeonButton>
          </FlexContainer>
        </InteractiveDemo>
      </Section>

      <GradientDivider $gradient="primary" />

      {/* Form Elements */}
      <Section>
        <h2 style={{ marginBottom: '1.5rem' }}>
          <GradientText $gradient="ocean">Form Elements</GradientText>
        </h2>
        <DemoCard>
          <h3>Glass Input Fields</h3>
          <FormGroup>
            <label htmlFor="name">Name</label>
            <GlassInput
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="email">Email</label>
            <GlassInput
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </FormGroup>
          <NeonButton
            $variant="gradient"
            $size="lg"
            onClick={() => {
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
          >
            Submit Form
          </NeonButton>
        </DemoCard>
      </Section>

      <GradientDivider $gradient="neon" />

      {/* Loading States */}
      <Section>
        <h2 style={{ marginBottom: '1.5rem' }}>
          <GradientText $gradient="sunset">Loading Skeletons</GradientText>
        </h2>
        <DemoCard>
          <h3>Shimmer Loading Effect</h3>
          <SkeletonLoader $height="40px" $width="100%" />
          <SkeletonLoader $height="20px" $width="80%" />
          <SkeletonLoader $height="20px" $width="60%" />
          <SkeletonLoader $height="100px" $radius="xl" />
        </DemoCard>
      </Section>

      {/* Floating Action Button */}
      <FloatingActionButton
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </FloatingActionButton>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
            }}
          >
            <GradientCard $gradient="success" style={{ minWidth: '300px', textAlign: 'center' }}>
              <h3>✅ Success!</h3>
              <p>Form submitted successfully</p>
            </GradientCard>
          </motion.div>
        )}
      </AnimatePresence>
    </DemoWrapper>
  );
}

export default ThemeDemo;

