import React from 'react';
import type { Task, Stage, User } from '../types';
import { getPriorityBadgeColor } from '../utils/helpers';

interface TimelineViewProps {
  stages: Stage[];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  currentUser: User;
}

const TimelineView: React.FC<TimelineViewProps> = ({ stages, tasks, onTaskClick }) => {

  const tasksWithDates = tasks.filter(t => t.dueDate);
  const sortedTasks = [...tasksWithDates].sort((a, b) => 
    (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0)
  );

  // Group by month
  const tasksByMonth = sortedTasks.reduce((acc, task) => {
    if (task.dueDate) {
      const monthKey = task.dueDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(task);
    }
    return acc;
  }, {} as Record<string, Task[]>);

  const getStage = (stageId: string) => stages.find(s => s.id === stageId);

  return (
    <div className="flex-1 overflow-auto px-6">
      <div className="max-w-5xl mx-auto">
        {Object.keys(tasksByMonth).length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            No tasks with due dates
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(tasksByMonth).map(([month, monthTasks]) => (
              <div key={month}>
                {/* Month Header */}
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-lg font-semibold text-white">{month}</h3>
                  <div className="flex-1 h-px bg-neutral-800" />
                  <span className="text-sm text-neutral-500">{monthTasks.length} tasks</span>
                </div>

                {/* Timeline */}
                <div className="relative pl-8">
                  {/* Vertical Line */}
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-neutral-800" />

                  {/* Tasks */}
                  <div className="space-y-6">
                    {monthTasks.map((task) => {
                      const stage = getStage(task.stageId);
                      
                      return (
                        <div key={task.id} className="relative">
                          {/* Timeline Dot */}
                          <div
                            className="absolute -left-6 top-2 w-3 h-3 rounded-full border-2 border-neutral-900"
                            style={{ backgroundColor: stage?.color || '#64748b' }}
                          />

                          {/* Task Card */}
                          <button
                            onClick={() => onTaskClick(task)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-colors text-left"
                          >
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {task.isRestricted && (
                                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                  )}
                                  <h4 className="text-sm font-medium text-white">{task.title}</h4>
                                </div>
                                {task.description && (
                                  <p className="text-xs text-neutral-400 line-clamp-2">{task.description}</p>
                                )}
                              </div>
                              
                              <div className="text-right shrink-0">
                                <div className="text-xs text-neutral-400 mb-1">
                                  {task.dueDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {/* Stage */}
                                {stage && (
                                  <span
                                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-white"
                                    style={{ backgroundColor: `${stage.color}40` }}
                                  >
                                    <div
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: stage.color }}
                                    />
                                    {stage.name}
                                  </span>
                                )}

                                {/* Assignees */}
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
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineView;
