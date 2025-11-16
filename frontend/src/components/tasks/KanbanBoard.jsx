// filepath: c:\Project_Manager\frontend\src\components\tasks\KanbanBoard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
`;

const columnIds = ['todo', 'inProgress', 'review', 'done'];

const columnConfig = {
  todo: { title: 'To Do', color: 'info', gradient: 'cosmic' },
  inProgress: { title: 'In Progress', color: 'warning', gradient: 'sunset' },
  review: { title: 'Review', color: 'secondary', gradient: 'aurora' },
  done: { title: 'Done', color: 'success', gradient: 'ocean' },
};

export default function KanbanBoard({ tasks: initialTasks, onTaskUpdate, onTaskCreate }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = event => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Handle drop on column
    if (columnIds.includes(overId)) {
      setTasks(prev => prev.map(t => (t.id === activeId ? { ...t, status: overId } : t)));
      return;
    }

    // Handle reorder within column
    if (activeId !== overId) {
      const activeTask = tasks.find(t => t.id === activeId);
      const overTask = tasks.find(t => t.id === overId);

      if (activeTask && overTask && activeTask.status === overTask.status) {
        setTasks(prev => {
          const oldIndex = prev.findIndex(t => t.id === activeId);
          const newIndex = prev.findIndex(t => t.id === overId);
          const newTasks = [...prev];
          const [removed] = newTasks.splice(oldIndex, 1);
          newTasks.splice(newIndex, 0, removed);
          return newTasks;
        });
      }
    }
  };

  const tasksByColumn = columnIds.reduce((acc, col) => {
    acc[col] = tasks.filter(t => t.status === col);
    return acc;
  }, {});

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <Board>
          {columnIds.map(colId => {
            const config = columnConfig[colId];
            const colTasks = tasksByColumn[colId] || [];
            return (
              <KanbanColumn
                key={colId}
                id={colId}
                title={config.title}
                color={config.color}
                gradient={config.gradient}
                count={colTasks.length}
              >
                <SortableContext
                  items={colTasks.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {colTasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                  ))}
                </SortableContext>
              </KanbanColumn>
            );
          })}
        </Board>
      </DndContext>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={updated => {
            setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)));
            setSelectedTask(null);
          }}
        />
      )}
    </>
  );
}
