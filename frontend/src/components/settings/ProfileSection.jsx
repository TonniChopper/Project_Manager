// filepath: c:\Project_Manager\frontend\src\components\settings\ProfileSection.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GlassCard, NeonButton, GlassInput } from '../../theme';
import settingsService from '../../services/settingsService';

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
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAvatarChange = async () => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async e => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ avatar: 'File size must be less than 5MB' });
        return;
      }

      setUploading(true);
      try {
        const response = await settingsService.uploadAvatar(file);
        setForm({ ...form, avatar: response.avatar_url });
        setErrors({ ...errors, avatar: null });
      } catch (error) {
        setErrors({ avatar: 'Failed to upload avatar' });
        // Fallback to random avatar for demo
        const newAvatar = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
        setForm({ ...form, avatar: newAvatar });
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name || form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(form);
    }
  };

  const handleReset = () => {
    setForm(data);
    setErrors({});
  };

  return (
    <Card>
      <h3 style={{ margin: 0 }}>Profile Information</h3>

      <AvatarSection>
        <AvatarPreview whileHover={{ scale: 1.05 }} style={{ opacity: uploading ? 0.6 : 1 }}>
          <img src={form.avatar} alt="Avatar" />
          <AvatarOverlay className="overlay" onClick={handleAvatarChange}>
            {uploading ? 'Uploading...' : 'Change Photo'}
          </AvatarOverlay>
        </AvatarPreview>

        <AvatarActions>
          <NeonButton $size="sm" onClick={handleAvatarChange} disabled={uploading}>
            Upload New
          </NeonButton>
          <NeonButton $variant="secondary" $size="sm">
            Remove
          </NeonButton>
        </AvatarActions>
      </AvatarSection>

      {errors.avatar && (
        <ErrorMessage initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
          ⚠️ {errors.avatar}
        </ErrorMessage>
      )}

      <Field>
        <label>Full Name</label>
        <GlassInput
          value={form.name}
          onChange={e => {
            setForm({ ...form, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: null });
          }}
          placeholder="Enter your name"
          style={{ borderColor: errors.name ? 'var(--error)' : undefined }}
        />
        {errors.name && (
          <ErrorMessage initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
            ⚠️ {errors.name}
          </ErrorMessage>
        )}
      </Field>

      <Field>
        <label>Email</label>
        <GlassInput
          type="email"
          value={form.email}
          onChange={e => {
            setForm({ ...form, email: e.target.value });
            if (errors.email) setErrors({ ...errors, email: null });
          }}
          placeholder="your@email.com"
          style={{ borderColor: errors.email ? 'var(--error)' : undefined }}
        />
        {errors.email && (
          <ErrorMessage initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
            ⚠️ {errors.email}
          </ErrorMessage>
        )}
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

const ErrorMessage = styled(motion.div)`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;
