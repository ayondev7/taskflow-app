import React from 'react';
import type { Task, Stage, User } from '../types';
import { formatTime, formatDate, getPriorityBadgeColor } from '../utils/helpers';

interface TaskDetailModalProps {
  task: Task;
  stage: Stage;
  onClose: () => void;
  onTimeTrackingToggle: (taskId: string) => void;
  currentUser: User;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  stage,
  onClose,
  onTimeTrackingToggle,
  currentUser
}) => {
  const canModify = !task.isRestricted || task.supervisor?.id === currentUser.id || currentUser.role === 'supervisor';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-neutral-900 rounded-lg border border-neutral-800 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              {task.isRestricted && (
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              <h2 className="text-2xl font-bold text-white">{task.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: `${stage.color}40` }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                {stage.name}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-neutral-300">{task.description || 'No description provided'}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Due Date */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Due Date</h3>
              <div className="flex items-center gap-2 text-sm text-white">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
              </div>
            </div>

            {/* Created */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Created</h3>
              <div className="text-sm text-white">
                {task.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Assigned Users */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Assigned To</h3>
            <div className="space-y-2">
              {task.assignedUsers.map(user => (
                <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg bg-neutral-800/50">
                  <div className="relative">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    {task.supervisor?.id === user.id && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-neutral-900" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                  {task.supervisor?.id === user.id && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">Supervisor</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Time Tracking */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Time Tracking</h3>
            <div className="bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Total Time</p>
                  <p className="text-2xl font-bold text-white">{formatTime(task.timeTracking.totalSeconds)}</p>
                </div>
                {task.timeTracking.isRunning && (
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs font-medium">Running</span>
                  </div>
                )}
              </div>
              {canModify && (
                <button
                  onClick={() => onTimeTrackingToggle(task.id)}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    task.timeTracking.isRunning
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {task.timeTracking.isRunning ? 'Stop Timer' : 'Start Timer'}
                </button>
              )}
            </div>
          </div>

          {/* Access Info */}
          {task.isRestricted && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-400 mb-1">Restricted Access</h4>
                  <p className="text-xs text-yellow-500/80">
                    Only supervisors can move this task between stages
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
