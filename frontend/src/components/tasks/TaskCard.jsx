// filepath: c:\Project_Manager\frontend\src\components\tasks\TaskCard.jsx
import React from 'react';
import styled from 'styled-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Badge } from '../../theme';

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.background.elevated};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: ${({ $isDragging }) => ($isDragging ? 'grabbing' : 'grab')};
  box-shadow: ${({ theme, $isDragging }) => ($isDragging ? theme.shadows.xl : theme.shadows.sm)};
  transition: all ${({ theme }) => theme.transitions.normal};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.text.primary};
`;

const CardDesc = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.text.tertiary};
`;

const Avatars = styled.div`
  display: flex;
  margin-left: auto;
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.background.elevated};
  margin-left: -8px;

  &:first-child {
    margin-left: 0;
  }
`;

const priorityVariant = {
  high: 'error',
  medium: 'warning',
  low: 'info',
};

export default function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      $isDragging={isDragging}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <CardTitle>{task.title}</CardTitle>
      {task.description && <CardDesc>{task.description}</CardDesc>}
      <CardFooter>
        <Meta>
          {task.priority && (
            <Badge $variant={priorityVariant[task.priority]}>{task.priority}</Badge>
          )}
          {task.dueDate && <span>📅 {task.dueDate}</span>}
        </Meta>
        {task.assignees && (
          <Avatars>
            {task.assignees.slice(0, 3).map((a, i) => (
              <Avatar key={i} src={a.avatar} alt={a.name} title={a.name} />
            ))}
          </Avatars>
        )}
      </CardFooter>
    </Card>
  );
}
