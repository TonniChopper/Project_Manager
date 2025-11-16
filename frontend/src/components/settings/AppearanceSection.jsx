// filepath: c:\Project_Manager\frontend\src\components\settings\AppearanceSection.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GlassCard, NeonButton } from '../../theme';
import { useTheme } from '../../theme/ThemeProvider';
import ToggleSwitch from './ToggleSwitch';
import Slider from './Slider';
import SegmentedControl from './SegmentedControl';

const Card = styled(GlassCard)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  h4 {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.text.primary};
  }
`;

const Setting = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.radius.lg};

  .info {
    flex: 1;

    .label {
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      color: ${({ theme }) => theme.text.primary};
      margin-bottom: ${({ theme }) => theme.spacing.xs};
    }

    .desc {
      font-size: ${({ theme }) => theme.fontSizes.sm};
      color: ${({ theme }) => theme.text.tertiary};
    }
  }
`;

const ThemePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const PreviewCard = styled(motion.div)`
  aspect-ratio: 16/10;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 2px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.border.light)};
  background: ${({ $dark, theme }) => ($dark ? theme.colors.gray800 : theme.colors.gray50)};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.gradients.mesh};
    opacity: 0.1;
  }

  .icon {
    font-size: ${({ theme }) => theme.fontSizes.xxxl};
  }
`;

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ColorSwatch = styled(motion.button)`
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $color, theme }) => theme.gradients[$color] || theme.colors[$color]};
  border: 2px solid ${({ $active, theme }) => ($active ? theme.colors.white : 'transparent')};
  box-shadow: ${({ $active, theme }) => ($active ? theme.shadows.glow : theme.shadows.sm)};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.border.glass};
`;

export default function AppearanceSection({ data, onSave }) {
  const { isDark, toggleTheme } = useTheme();
  const [form, setForm] = useState(data);

  const handleSave = () => {
    onSave(form);
  };

  const colors = ['primary', 'secondary', 'accent', 'cosmic', 'sunset', 'ocean'];
  const fontSizes = ['small', 'medium', 'large'];

  return (
    <Card>
      <h3 style={{ margin: 0 }}>Appearance</h3>

      <Section>
        <h4>Theme</h4>
        <ThemePreview>
          <PreviewCard
            $active={!isDark}
            $dark={false}
            onClick={() => !isDark || toggleTheme()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="icon">☀️</div>
          </PreviewCard>
          <PreviewCard
            $active={isDark}
            $dark={true}
            onClick={() => isDark || toggleTheme()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="icon">🌙</div>
          </PreviewCard>
        </ThemePreview>
      </Section>

      <Section>
        <h4>Accent Color</h4>
        <ColorPalette>
          {colors.map(color => (
            <ColorSwatch
              key={color}
              $color={color}
              $active={form.accentColor === color}
              onClick={() => setForm({ ...form, accentColor: color })}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </ColorPalette>
      </Section>

      <Section>
        <h4>Font Size</h4>
        <SegmentedControl
          options={fontSizes}
          value={form.fontSize}
          onChange={val => setForm({ ...form, fontSize: val })}
        />
      </Section>

      <Section>
        <h4>Accessibility</h4>
        <Setting>
          <div className="info">
            <div className="label">Reduced Motion</div>
            <div className="desc">Minimize animations for better accessibility</div>
          </div>
          <ToggleSwitch
            checked={form.reducedMotion}
            onChange={val => setForm({ ...form, reducedMotion: val })}
          />
        </Setting>
      </Section>

      <Section>
        <h4>Display Density</h4>
        <Slider min={0} max={100} value={50} onChange={() => {}} label="Comfortable" />
      </Section>

      <Actions>
        <NeonButton $variant="secondary" onClick={() => setForm(data)}>
          Reset
        </NeonButton>
        <NeonButton onClick={handleSave}>Save Changes</NeonButton>
      </Actions>
    </Card>
  );
}
