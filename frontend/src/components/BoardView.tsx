import React from 'react';
import type { Task, Stage, User } from '../types';
import TaskCard from './TaskCard';

interface BoardViewProps {
  stages: Stage[];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  currentUser: User;
}

const BoardView: React.FC<BoardViewProps> = ({ stages, tasks, onTaskClick, currentUser }) => {
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  return (
    <div className="flex-1 overflow-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedStages.map(stage => {
          const stageTasks = tasks.filter(task => task.stageId === stage.id);
          
          return (
            <div
              key={stage.id}
              className="bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col"
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

              {/* Tasks */}
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {stageTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onTaskClick={onTaskClick}
                    currentUser={currentUser}
                  />
                ))}
                {stageTasks.length === 0 && (
                  <div className="text-center py-6 text-neutral-600 text-sm">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BoardView;
