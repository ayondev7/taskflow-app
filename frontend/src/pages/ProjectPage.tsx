import React, { useState, useMemo } from 'react';
import type { Project, Task, FilterOptions, SortOption, Priority } from '../types';
import KanbanView from '../components/KanbanView';
import ListView from '../components/ListView';
import BoardView from '../components/BoardView';
import TimelineView from '../components/TimelineView';
import TaskDetailModal from '../components/TaskDetailModal';
import FilterSortPanel from '../components/FilterSortPanel';
import { filterTasks, sortTasks } from '../utils/helpers';

interface ProjectPageProps {
  project: Project;
  currentUserId: string;
  currentView: string;
  searchQuery: string;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ project, currentUserId, currentView, searchQuery }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    stages: [],
    priorities: [],
    assignees: [],
    searchQuery: ''
  });
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'createdAt',
    direction: 'desc'
  });

  const currentUser = project.members.find(m => m.id === currentUserId)!;

  const filteredAndSortedTasks = useMemo(() => {
    const filtered = filterTasks(project.tasks, { ...filters, searchQuery });
    return sortTasks(filtered, sortOption);
  }, [project.tasks, filters, searchQuery, sortOption]);

  const handleTaskMove = (taskId: string, newStageId: string) => {
    // In a real app, this would update the backend
    console.log(`Moving task ${taskId} to stage ${newStageId}`);
  };

  const handleTimeTrackingToggle = (taskId: string) => {
    // In a real app, this would update the backend
    console.log(`Toggle time tracking for task ${taskId}`);
  };

  const handleFilterChange = (newFilters: { stages: string[]; priorities: Priority[] }) => {
    setFilters(prev => ({ ...prev, stages: newFilters.stages, priorities: newFilters.priorities }));
  };

  const handleSortChange = (field: SortOption['field'], direction: SortOption['direction']) => {
    setSortOption({ field, direction });
  };

  const selectedStage = selectedTask ? project.stages.find(s => s.id === selectedTask.stageId) : null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Filter and Sort Panel */}
      <FilterSortPanel
        stages={project.stages}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {/* View Content */}
      <div className="flex-1 overflow-hidden py-6">
        {currentView === 'kanban' && (
          <KanbanView
            stages={project.stages}
            tasks={filteredAndSortedTasks}
            onTaskClick={setSelectedTask}
            onTaskMove={handleTaskMove}
            currentUser={currentUser}
          />
        )}
        {currentView === 'list' && (
          <ListView
            stages={project.stages}
            tasks={filteredAndSortedTasks}
            onTaskClick={setSelectedTask}
            currentUser={currentUser}
          />
        )}
        {currentView === 'board' && (
          <BoardView
            stages={project.stages}
            tasks={filteredAndSortedTasks}
            onTaskClick={setSelectedTask}
            currentUser={currentUser}
          />
        )}
        {currentView === 'timeline' && (
          <TimelineView
            stages={project.stages}
            tasks={filteredAndSortedTasks}
            onTaskClick={setSelectedTask}
            currentUser={currentUser}
          />
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && selectedStage && (
        <TaskDetailModal
          task={selectedTask}
          stage={selectedStage}
          onClose={() => setSelectedTask(null)}
          onTimeTrackingToggle={handleTimeTrackingToggle}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default ProjectPage;
