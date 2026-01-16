export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ViewType = 'list' | 'kanban' | 'timeline';
export type UserRole = 'supervisor' | 'member';
export type ProjectStatus = 'active' | 'archived';
export type NotificationType = 'task_assigned' | 'task_reassigned' | 'stage_changed' | 'mentioned' | 'project_access';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

export interface TimeTracking {
  isRunning: boolean;
  totalSeconds: number;
  startedAt?: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: Date | null;
  assignedUsers: User[];
  supervisor?: User;
  stageId: string;
  isRestricted: boolean;
  timeTracking: TimeTracking;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stage {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  stages: Stage[];
  tasks: Task[];
  members: User[];
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  timestamp: Date;
  projectId: string;
  taskId?: string;
}

export interface FilterOptions {
  stages: string[];
  priorities: Priority[];
  assignees: string[];
  searchQuery: string;
}

export interface SortOption {
  field: 'title' | 'priority' | 'dueDate' | 'createdAt';
  direction: 'asc' | 'desc';
}
