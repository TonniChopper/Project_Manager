// filepath: c:\Project_Manager\frontend\src\components\settings\NotificationSection.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { GlassCard, NeonButton } from '../../theme';
import ToggleSwitch from './ToggleSwitch';

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

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.border.glass};
`;

export default function NotificationSection({ data, onSave }) {
  const [form, setForm] = useState(data);

  const handleSave = () => {
    onSave(form);
  };

  const settings = [
    {
      key: 'email',
      label: 'Email Notifications',
      desc: 'Receive notifications via email',
    },
    {
      key: 'push',
      label: 'Push Notifications',
      desc: 'Get browser push notifications',
    },
    {
      key: 'mentions',
      label: 'Mentions & Replies',
      desc: 'Notify when someone mentions or replies to you',
    },
    {
      key: 'updates',
      label: 'Product Updates',
      desc: 'News about new features and improvements',
    },
    {
      key: 'marketing',
      label: 'Marketing Communications',
      desc: 'Tips, offers, and newsletters',
    },
  ];

  return (
    <Card>
      <h3 style={{ margin: 0 }}>Notification Preferences</h3>

      <Section>
        <h4>Communication</h4>
        {settings.map(setting => (
          <Setting key={setting.key}>
            <div className="info">
              <div className="label">{setting.label}</div>
              <div className="desc">{setting.desc}</div>
            </div>
            <ToggleSwitch
              checked={form[setting.key]}
              onChange={val => setForm({ ...form, [setting.key]: val })}
            />
          </Setting>
        ))}
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
