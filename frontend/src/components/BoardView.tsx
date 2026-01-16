import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { Task, Stage, User } from '../types';
import TaskCard from './TaskCard';

interface BoardViewProps {
  stages: Stage[];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskMove: (taskId: string, newStageId: string) => void;
  currentUser: User;
}

const BoardView: React.FC<BoardViewProps> = ({
  stages,
  tasks,
  onTaskClick,
  onTaskMove,
  currentUser
}) => {
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Task moved to a different stage
    if (destination.droppableId !== source.droppableId) {
      const taskId = draggableId;
      const newStageId = destination.droppableId;
      
      // Check if user can move this task
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const canMove = !task.isRestricted || 
                       task.supervisor?.id === currentUser.id || 
                       currentUser.role === 'supervisor';
        
        if (canMove) {
          onTaskMove(taskId, newStageId);
        }
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full overflow-x-auto pb-4 px-6">
        {sortedStages.map(stage => {
          const stageTasks = tasks.filter(task => task.stageId === stage.id);
          
          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col"
            >
              {/* Stage Header */}
              <div className="p-4 border-b border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <h3 className="text-sm font-semibold text-white">{stage.name}</h3>
                  </div>
                  <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded">
                    {stageTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks - Droppable Area */}
              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 overflow-y-auto p-4 space-y-3 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-neutral-800/50' : ''
                    }`}
                  >
                    {stageTasks.map((task, index) => {
                      const canMove = !task.isRestricted || 
                                     task.supervisor?.id === currentUser.id || 
                                     currentUser.role === 'supervisor';
                      
                      return (
                        <Draggable 
                          key={task.id} 
                          draggableId={task.id} 
                          index={index}
                          isDragDisabled={!canMove}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.8 : 1,
                              }}
                            >
                              <TaskCard
                                task={task}
                                onTaskClick={onTaskClick}
                                currentUser={currentUser}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                    {stageTasks.length === 0 && (
                      <div className="text-center py-8 text-neutral-600 text-sm">
                        No tasks
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default BoardView;
