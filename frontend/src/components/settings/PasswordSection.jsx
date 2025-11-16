// filepath: c:\Project_Manager\frontend\src\components\settings\PasswordSection.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GlassCard, NeonButton, GlassInput } from '../../theme';

const Card = styled(GlassCard)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
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

const InputWrapper = styled.div`
  position: relative;
`;

const ErrorMessage = styled(motion.div)`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StrengthMeter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const StrengthBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.full};
  overflow: hidden;
`;

const StrengthFill = styled(motion.div)`
  height: 100%;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $strength, theme }) => {
    const colors = {
      weak: theme.colors.error,
      fair: theme.colors.warning,
      good: theme.colors.info,
      strong: theme.colors.success,
    };
    return colors[$strength] || theme.colors.error;
  }};
  transition: all ${({ theme }) => theme.transitions.normal};
`;

const StrengthLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.text.tertiary};

  .strength {
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ $strength, theme }) => {
      const colors = {
        weak: theme.colors.error,
        fair: theme.colors.warning,
        good: theme.colors.info,
        strong: theme.colors.success,
      };
      return colors[$strength] || theme.text.tertiary;
    }};
    text-transform: capitalize;
  }
`;

const Requirements = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Requirement = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ $met, theme }) => ($met ? theme.colors.success : theme.text.tertiary)};

  .icon {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ $met, theme }) => ($met ? theme.colors.success : theme.background.tertiary)};
    color: ${({ theme }) => theme.colors.white};
    font-size: 10px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.border.glass};
`;

export default function PasswordSection({ onSave }) {
  const [form, setForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState({ level: 'weak', score: 0 });

  const requirements = [
    { id: 'length', label: 'At least 8 characters', test: pw => pw.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter', test: pw => /[A-Z]/.test(pw) },
    { id: 'lowercase', label: 'One lowercase letter', test: pw => /[a-z]/.test(pw) },
    { id: 'number', label: 'One number', test: pw => /[0-9]/.test(pw) },
    { id: 'special', label: 'One special character', test: pw => /[^A-Za-z0-9]/.test(pw) },
  ];

  const calculateStrength = password => {
    const met = requirements.filter(r => r.test(password)).length;
    const score = (met / requirements.length) * 100;
    let level = 'weak';
    if (score >= 80) level = 'strong';
    else if (score >= 60) level = 'good';
    else if (score >= 40) level = 'fair';
    setStrength({ level, score });
  };

  const handlePasswordChange = value => {
    setForm({ ...form, new: value });
    calculateStrength(value);
    if (errors.new) setErrors({ ...errors, new: null });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.current) newErrors.current = 'Current password is required';
    if (!form.new) newErrors.new = 'New password is required';
    else if (form.new.length < 8) newErrors.new = 'Password must be at least 8 characters';
    if (form.new !== form.confirm) newErrors.confirm = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave({ current: form.current, new: form.new });
      setForm({ current: '', new: '', confirm: '' });
      setStrength({ level: 'weak', score: 0 });
    }
  };

  return (
    <Card>
      <h3 style={{ margin: 0 }}>Change Password</h3>

      <Field>
        <label>Current Password</label>
        <InputWrapper>
          <GlassInput
            type="password"
            value={form.current}
            onChange={e => {
              setForm({ ...form, current: e.target.value });
              if (errors.current) setErrors({ ...errors, current: null });
            }}
            placeholder="Enter current password"
            style={{ borderColor: errors.current ? 'var(--error)' : undefined }}
          />
          {errors.current && (
            <ErrorMessage initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
              ⚠️ {errors.current}
            </ErrorMessage>
          )}
        </InputWrapper>
      </Field>

      <Field>
        <label>New Password</label>
        <InputWrapper>
          <GlassInput
            type="password"
            value={form.new}
            onChange={e => handlePasswordChange(e.target.value)}
            placeholder="Enter new password"
            style={{ borderColor: errors.new ? 'var(--error)' : undefined }}
          />
          {errors.new && (
            <ErrorMessage initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
              ⚠️ {errors.new}
            </ErrorMessage>
          )}
        </InputWrapper>

        {form.new && (
          <StrengthMeter>
            <StrengthBar>
              <StrengthFill
                $strength={strength.level}
                initial={{ width: 0 }}
                animate={{ width: `${strength.score}%` }}
                transition={{ duration: 0.3 }}
              />
            </StrengthBar>
            <StrengthLabel $strength={strength.level}>
              <span>Password strength</span>
              <span className="strength">{strength.level}</span>
            </StrengthLabel>
          </StrengthMeter>
        )}

        <Requirements>
          {requirements.map(req => {
            const met = req.test(form.new);
            return (
              <Requirement
                key={req.id}
                $met={met}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="icon">{met ? '✓' : ''}</div>
                <span>{req.label}</span>
              </Requirement>
            );
          })}
        </Requirements>
      </Field>

      <Field>
        <label>Confirm New Password</label>
        <InputWrapper>
          <GlassInput
            type="password"
            value={form.confirm}
            onChange={e => {
              setForm({ ...form, confirm: e.target.value });
              if (errors.confirm) setErrors({ ...errors, confirm: null });
            }}
            placeholder="Confirm new password"
            style={{ borderColor: errors.confirm ? 'var(--error)' : undefined }}
          />
          {errors.confirm && (
            <ErrorMessage initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
              ⚠️ {errors.confirm}
            </ErrorMessage>
          )}
        </InputWrapper>
      </Field>

      <Actions>
        <NeonButton
          $variant="secondary"
          onClick={() => setForm({ current: '', new: '', confirm: '' })}
        >
          Cancel
        </NeonButton>
        <NeonButton onClick={handleSave}>Update Password</NeonButton>
      </Actions>
    </Card>
  );
}
