// filepath: c:\Project_Manager\frontend\src\components\tasks\TaskModal.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { NeonButton, GlassInput, Badge } from '../../theme';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: ${({ theme }) => theme.zIndices.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Modal = styled(motion.div)`
  background: ${({ theme }) => theme.background.elevated};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xxl};
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.background.glass};
  border: 1px solid ${({ theme }) => theme.border.glass};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    transform: rotate(90deg);
  }
`;

const Field = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  label {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
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

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.border.medium};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.primary};

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
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export default function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority || 'medium',
    dueDate: task.dueDate || '',
  });

  const handleSave = () => {
    onSave({ ...task, ...form });
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <Modal
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
        >
          <Header>
            <h2 style={{ margin: 0 }}>Edit Task</h2>
            <CloseBtn onClick={onClose}>✕</CloseBtn>
          </Header>

          <Field>
            <label>Title</label>
            <GlassInput
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </Field>

          <Field>
            <label>Description</label>
            <Textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Add details about this task..."
            />
          </Field>

          <Field>
            <label>Status</label>
            <Select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </Select>
          </Field>

          <Field>
            <label>Priority</label>
            <Select
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </Field>

          <Field>
            <label>Due Date</label>
            <GlassInput
              type="date"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
            />
          </Field>

          <Actions>
            <NeonButton $variant="secondary" onClick={onClose}>
              Cancel
            </NeonButton>
            <NeonButton onClick={handleSave}>Save Changes</NeonButton>
          </Actions>
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
}
