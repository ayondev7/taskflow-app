import React from 'react';
import type { Task, Stage, User } from '../types';
import { formatTime, formatDate, getPriorityBadgeColor } from '../utils/helpers';

interface ListViewProps {
  stages: Stage[];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  currentUser: User;
}

const ListView: React.FC<ListViewProps> = ({ stages, tasks, onTaskClick }) => {
  const getStageColor = (stageId: string) => {
    return stages.find(s => s.id === stageId)?.color || '#64748b';
  };

  return (
    <div className="flex-1 overflow-auto px-6">
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-neutral-800 border-b border-neutral-700 text-xs font-semibold text-neutral-400 uppercase">
          <div className="col-span-4">Task</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Assignees</div>
          <div className="col-span-1">Due Date</div>
          <div className="col-span-1">Time</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-neutral-800">
          {tasks.map(task => {
            const stage = stages.find(s => s.id === task.stageId);
            
            return (
              <button
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-neutral-800/50 transition-colors text-left w-full items-center"
              >
                {/* Task */}
                <div className="col-span-4 flex items-start gap-2">
                  {task.isRestricted && (
                    <svg className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">{task.title}</h3>
                    {task.description && (
                      <p className="text-xs text-neutral-400 truncate mt-0.5">{task.description}</p>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: `${getStageColor(task.stageId)}40` }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStageColor(task.stageId) }}
                    />
                    {stage?.name}
                  </span>
                </div>

                {/* Priority */}
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>

                {/* Assignees */}
                <div className="col-span-2">
                  <div className="flex items-center -space-x-2">
                    {task.assignedUsers.slice(0, 3).map((user) => (
                      <div
                        key={user.id}
                        className="relative"
                        title={user.name}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-6 h-6 rounded-full border-2 border-neutral-900"
                        />
                        {task.supervisor?.id === user.id && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-neutral-900" />
                        )}
                      </div>
                    ))}
                    {task.assignedUsers.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-neutral-700 border-2 border-neutral-900 flex items-center justify-center">
                        <span className="text-xs text-neutral-400">+{task.assignedUsers.length - 3}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Due Date */}
                <div className="col-span-1">
                  <span className="text-xs text-neutral-400">
                    {task.dueDate ? formatDate(task.dueDate) : '-'}
                  </span>
                </div>

                {/* Time */}
                <div className="col-span-1">
                  {task.timeTracking.totalSeconds > 0 ? (
                    <span className="text-xs text-neutral-400">
                      {formatTime(task.timeTracking.totalSeconds)}
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-600">-</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <div className="py-12 text-center text-neutral-500">
            No tasks found
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
