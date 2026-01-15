import { useState, useCallback } from 'react';
import type { Task, Project } from '../types';

export const useProjectState = (initialProject: Project) => {
  const [project, setProject] = useState<Project>(initialProject);

  const updateTaskStage = useCallback((taskId: string, newStageId: string) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, stageId: newStageId } : task
      )
    }));
  }, []);

  const toggleTimeTracking = useCallback((taskId: string) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => {
        if (task.id !== taskId) return task;
        
        const isRunning = task.timeTracking.isRunning;
        const now = new Date();
        
        if (isRunning && task.timeTracking.startedAt) {
          // Stop timer
          const elapsed = Math.floor((now.getTime() - task.timeTracking.startedAt.getTime()) / 1000);
          return {
            ...task,
            timeTracking: {
              isRunning: false,
              totalSeconds: task.timeTracking.totalSeconds + elapsed,
              startedAt: undefined
            }
          };
        } else {
          // Start timer
          return {
            ...task,
            timeTracking: {
              ...task.timeTracking,
              isRunning: true,
              startedAt: now
            }
          };
        }
      })
    }));
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
  }, []);

  return {
    project,
    updateTaskStage,
    toggleTimeTracking,
    updateTask
  };
};
