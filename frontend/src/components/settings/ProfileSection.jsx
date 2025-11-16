// filepath: c:\Project_Manager\frontend\src\components\settings\ProfileSection.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GlassCard, NeonButton, GlassInput } from '../../theme';

const Card = styled(GlassCard)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const AvatarPreview = styled(motion.div)`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.radius.full};
  overflow: hidden;
  border: 3px solid ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.glow};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover .overlay {
    opacity: 1;
  }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.normal};
  cursor: pointer;
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const AvatarActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  label {
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.text.secondary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.border.medium};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.fonts.body};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.border.glass};
`;

export default function ProfileSection({ data, onSave }) {
  const [form, setForm] = useState(data);
  const [avatarHover, setAvatarHover] = useState(false);

  const handleAvatarChange = () => {
    // Simulate avatar upload
    const newAvatar = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
    setForm({ ...form, avatar: newAvatar });
  };

  const handleSave = () => {
    onSave(form);
  };

  const handleReset = () => {
    setForm(data);
  };

  return (
    <Card>
      <h3 style={{ margin: 0 }}>Profile Information</h3>

      <AvatarSection>
        <AvatarPreview
          onHoverStart={() => setAvatarHover(true)}
          onHoverEnd={() => setAvatarHover(false)}
          whileHover={{ scale: 1.05 }}
        >
          <img src={form.avatar} alt="Avatar" />
          <AvatarOverlay className="overlay" onClick={handleAvatarChange}>
            Change Photo
          </AvatarOverlay>
        </AvatarPreview>

        <AvatarActions>
          <NeonButton $size="sm" onClick={handleAvatarChange}>
            Upload New
          </NeonButton>
          <NeonButton $variant="secondary" $size="sm">
            Remove
          </NeonButton>
        </AvatarActions>
      </AvatarSection>

      <Field>
        <label>Full Name</label>
        <GlassInput
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Enter your name"
        />
      </Field>

      <Field>
        <label>Email</label>
        <GlassInput
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="your@email.com"
        />
      </Field>

      <Field>
        <label>Location</label>
        <GlassInput
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
          placeholder="City, Country"
        />
      </Field>

      <Field>
        <label>Bio</label>
        <Textarea
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })}
          placeholder="Tell us about yourself..."
        />
      </Field>

      <Actions>
        <NeonButton $variant="secondary" onClick={handleReset}>
          Reset
        </NeonButton>
        <NeonButton onClick={handleSave}>Save Changes</NeonButton>
      </Actions>
    </Card>
  );
}
