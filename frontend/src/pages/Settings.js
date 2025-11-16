// filepath: c:\Project_Manager\frontend\src\pages\Settings.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GradientText } from '../theme';
import ProfileSection from '../components/settings/ProfileSection';
import AppearanceSection from '../components/settings/AppearanceSection';
import NotificationSection from '../components/settings/NotificationSection';
import PasswordSection from '../components/settings/PasswordSection';
import settingsService from '../services/settingsService';

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxl};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  margin: 0;
`;

const Tabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.background.glass};
  border: 1px solid ${({ theme }) => theme.border.glass};
  border-radius: ${({ theme }) => theme.radius.full};
  padding: ${({ theme }) => theme.spacing.xs};
  backdrop-filter: ${({ theme }) => theme.blur.md};
`;

const Tab = styled(motion.button)`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.gradients.primary : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.text.secondary)};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.primary)};
  }
`;

const SaveFeedback = styled(motion.div)`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.gradients.success};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: ${({ theme }) => theme.shadows.glowLg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: ${({ theme }) => theme.zIndices.toast};
`;

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showSaved, setShowSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Product designer & developer',
      location: 'San Francisco, CA',
    },
    appearance: {
      theme: 'dark',
      accentColor: 'primary',
      fontSize: 'medium',
      reducedMotion: false,
    },
    notifications: {
      email: true,
      push: true,
      mentions: true,
      updates: false,
      marketing: false,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [profile, appearance, notifications] = await Promise.all([
        settingsService.getUserProfile().catch(() => settings.profile),
        settingsService.getUserSettings().catch(() => settings.appearance),
        settingsService.getNotificationSettings().catch(() => settings.notifications),
      ]);
      setSettings({ profile, appearance, notifications });
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section, data) => {
    setLoading(true);
    try {
      if (section === 'profile') {
        await settingsService.updateUserProfile(data);
      } else if (section === 'appearance') {
        await settingsService.updateUserSettings(data);
      } else if (section === 'notifications') {
        await settingsService.updateNotificationSettings(data);
      }
      setSettings(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async data => {
    setLoading(true);
    try {
      await settingsService.changePassword(data.current, data.new);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (error) {
      console.error('Failed to change password:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'password', label: 'Password' },
  ];

  return (
    <Wrapper>
      <Header>
        <Title>
          <GradientText>Settings</GradientText>
        </Title>
      </Header>

      <Tabs>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label}
          </Tab>
        ))}
      </Tabs>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'profile' && (
          <ProfileSection data={settings.profile} onSave={data => handleSave('profile', data)} />
        )}
        {activeTab === 'appearance' && (
          <AppearanceSection
            data={settings.appearance}
            onSave={data => handleSave('appearance', data)}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationSection
            data={settings.notifications}
            onSave={data => handleSave('notifications', data)}
          />
        )}
        {activeTab === 'password' && <PasswordSection onSave={handlePasswordChange} />}
      </motion.div>

      {showSaved && (
        <SaveFeedback
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          ✓ Settings saved successfully!
        </SaveFeedback>
      )}
    </Wrapper>
  );
}
