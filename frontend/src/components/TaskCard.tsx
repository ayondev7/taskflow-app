import React from 'react';
import type { Task, User } from '../types';
import { formatTime, formatDate, getPriorityBadgeColor } from '../utils/helpers';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  currentUser: User;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskClick, currentUser, isDragging = false }) => {
  const canMove = !task.isRestricted || task.supervisor?.id === currentUser.id || currentUser.role === 'supervisor';

  return (
    <div
      onClick={() => onTaskClick(task)}
      className={`bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:border-neutral-600 transition-all cursor-pointer ${
        isDragging ? 'shadow-2xl rotate-2' : 'hover:shadow-lg'
      } ${!canMove ? 'opacity-75 cursor-not-allowed' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-medium text-white flex-1 line-clamp-2">{task.title}</h3>
        {task.isRestricted && (
          <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-neutral-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Priority and Due Date */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-xs text-neutral-500">
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Assigned Users */}
        <div className="flex items-center -space-x-2">
          {task.assignedUsers.slice(0, 3).map((user) => (
            <div
              key={user.id}
              className="relative"
              title={`${user.name}${task.supervisor?.id === user.id ? ' (Supervisor)' : ''}`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-full border-2 border-neutral-800"
              />
              {task.supervisor?.id === user.id && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-neutral-800" />
              )}
            </div>
          ))}
          {task.assignedUsers.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-neutral-700 border-2 border-neutral-800 flex items-center justify-center">
              <span className="text-xs text-neutral-400">+{task.assignedUsers.length - 3}</span>
            </div>
          )}
        </div>

        {/* Time Tracking */}
        {task.timeTracking.totalSeconds > 0 && (
          <div className="flex items-center gap-1 text-xs text-neutral-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatTime(task.timeTracking.totalSeconds)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
