import type { Task, FilterOptions, SortOption, Priority } from '../types';

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

export const formatDate = (date: Date | null): string => {
  if (!date) return 'No due date';
  
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return `Overdue ${Math.abs(days)}d`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days <= 7) return `Due in ${days}d`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getPriorityColor = (priority: Priority): string => {
  const colors = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    urgent: 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  return colors[priority];
};

export const getPriorityBadgeColor = (priority: Priority): string => {
  const colors = {
    low: 'bg-blue-500/10 text-blue-400',
    medium: 'bg-yellow-500/10 text-yellow-400',
    high: 'bg-orange-500/10 text-orange-400',
    urgent: 'bg-red-500/10 text-red-400'
  };
  return colors[priority];
};

export const filterTasks = (tasks: Task[], filters: FilterOptions): Task[] => {
  return tasks.filter(task => {
    // Filter by stages
    if (filters.stages.length > 0 && !filters.stages.includes(task.stageId)) {
      return false;
    }
    
    // Filter by priorities
    if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
      return false;
    }
    
    // Filter by assignees
    if (filters.assignees.length > 0) {
      const hasAssignee = task.assignedUsers.some(user => 
        filters.assignees.includes(user.id)
      );
      if (!hasAssignee) return false;
    }
    
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesDescription = task.description.toLowerCase().includes(query);
      const matchesAssignee = task.assignedUsers.some(user => 
        user.name.toLowerCase().includes(query)
      );
      if (!matchesTitle && !matchesDescription && !matchesAssignee) {
        return false;
      }
    }
    
    return true;
  });
};

export const sortTasks = (tasks: Task[], sortOption: SortOption): Task[] => {
  const sorted = [...tasks];
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    switch (sortOption.field) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'priority': {
        const priorityOrder = { low: 0, medium: 1, high: 2, urgent: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      }
      case 'dueDate': {
        const aTime = a.dueDate?.getTime() ?? Infinity;
        const bTime = b.dueDate?.getTime() ?? Infinity;
        comparison = aTime - bTime;
        break;
      }
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
    }
    
    return sortOption.direction === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
