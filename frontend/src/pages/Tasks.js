import React, { useState } from 'react';
import styled from 'styled-components';
import { NeonButton, GradientText } from '../theme';
import KanbanBoard from '../components/tasks/KanbanBoard';

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

const mockTasks = [
  {
    id: 't1',
    title: 'Design new landing page',
    description: 'Create mockups for the homepage redesign with modern aesthetics',
    status: 'todo',
    priority: 'high',
    dueDate: '2025-11-20',
    assignees: [{ name: 'Alice', avatar: 'https://i.pravatar.cc/100?img=5' }],
  },
  {
    id: 't2',
    title: 'Implement authentication',
    description: 'Add JWT-based auth with refresh tokens',
    status: 'inProgress',
    priority: 'high',
    dueDate: '2025-11-18',
    assignees: [{ name: 'Bob', avatar: 'https://i.pravatar.cc/100?img=8' }],
  },
  {
    id: 't3',
    title: 'Write API documentation',
    description: 'Document all endpoints with OpenAPI spec',
    status: 'inProgress',
    priority: 'medium',
    assignees: [
      { name: 'Charlie', avatar: 'https://i.pravatar.cc/100?img=12' },
      { name: 'Dana', avatar: 'https://i.pravatar.cc/100?img=15' },
    ],
  },
  {
    id: 't4',
    title: 'Code review for chat feature',
    description: 'Review PR #42 for real-time messaging',
    status: 'review',
    priority: 'medium',
    dueDate: '2025-11-17',
    assignees: [{ name: 'Eve', avatar: 'https://i.pravatar.cc/100?img=20' }],
  },
  {
    id: 't5',
    title: 'Deploy to staging',
    description: 'Push latest build to staging environment',
    status: 'done',
    priority: 'low',
    assignees: [],
  },
  {
    id: 't6',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: 'done',
    priority: 'high',
    assignees: [{ name: 'Frank', avatar: 'https://i.pravatar.cc/100?img=25' }],
  },
];

export default function Tasks() {
  const [tasks, setTasks] = useState(mockTasks);

  const handleCreateTask = () => {
    const newTask = {
      id: `t${Date.now()}`,
      title: 'New Task',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      assignees: [],
    };
    setTasks(prev => [...prev, newTask]);
  };

  return (
    <Wrapper>
      <Header>
        <Title>
          <GradientText>Tasks</GradientText>
        </Title>
        <NeonButton onClick={handleCreateTask}>+ New Task</NeonButton>
      </Header>

      <KanbanBoard
        tasks={tasks}
        onTaskUpdate={updated =>
          setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)))
        }
        onTaskCreate={handleCreateTask}
      />
    </Wrapper>
  );
}
