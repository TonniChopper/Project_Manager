import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NeonButton, GradientText } from '../theme';
import KanbanBoard from '../components/tasks/KanbanBoard';
import taskService from '../services/taskService';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  margin: 0;
`;

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      const newTask = await taskService.createTask({
        title: 'New Task',
        description: '',
        status: 'todo',
        priority: 'medium',
      });
      setTasks(prev => [...prev, newTask]);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleTaskUpdate = async updated => {
    try {
      await taskService.updateTask(updated.id, updated);
      setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <Header>
          <Title>
            <GradientText>Tasks</GradientText>
          </Title>
        </Header>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading tasks...</div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header>
        <Title>
          <GradientText>Tasks</GradientText>
        </Title>
        <NeonButton onClick={handleCreateTask}>+ New Task</NeonButton>
      </Header>

      <KanbanBoard tasks={tasks} onTaskUpdate={handleTaskUpdate} onTaskCreate={handleCreateTask} />
    </Wrapper>
  );
}
