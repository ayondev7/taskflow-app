import type { User, Project, Stage, Task, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'supervisor'
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    role: 'member'
  },
  {
    id: 'user3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    role: 'member'
  },
  {
    id: 'user4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    role: 'member'
  }
];

export const currentUser = mockUsers[0]; // John Doe as current user

export const defaultStages: Stage[] = [
  { id: 'stage1', name: 'To Do', color: '#64748b', order: 1 },
  { id: 'stage2', name: 'In Progress', color: '#3b82f6', order: 2 },
  { id: 'stage3', name: 'In Review', color: '#f59e0b', order: 3 },
  { id: 'stage4', name: 'Done', color: '#10b981', order: 4 }
];

const createTask = (
  id: string,
  title: string,
  description: string,
  stageId: string,
  priority: 'low' | 'medium' | 'high' | 'urgent',
  assignedUsers: User[],
  dueDate: Date | null,
  supervisor?: User,
  isRestricted: boolean = false,
  totalSeconds: number = 0
): Task => ({
  id,
  title,
  description,
  priority,
  dueDate,
  assignedUsers,
  supervisor,
  stageId,
  isRestricted,
  timeTracking: {
    isRunning: false,
    totalSeconds,
    startedAt: undefined
  },
  createdAt: new Date('2026-01-10'),
  updatedAt: new Date('2026-01-13')
});

export const mockTasks: Task[] = [
  createTask(
    'task1',
    'Design homepage mockup',
    'Create a modern, responsive homepage design with dark theme',
    'stage1',
    'high',
    [mockUsers[1], mockUsers[2]],
    new Date('2026-01-20'),
    mockUsers[0],
    false,
    3600
  ),
  createTask(
    'task2',
    'Implement authentication',
    'Set up Google OAuth and user session management',
    'stage2',
    'urgent',
    [mockUsers[1]],
    new Date('2026-01-15'),
    mockUsers[0],
    true,
    7200
  ),
  createTask(
    'task3',
    'Database schema design',
    'Design the database schema for tasks, projects, and users',
    'stage2',
    'high',
    [mockUsers[2], mockUsers[3]],
    new Date('2026-01-18'),
    mockUsers[0],
    false,
    5400
  ),
  createTask(
    'task4',
    'API documentation',
    'Write comprehensive API documentation for all endpoints',
    'stage3',
    'medium',
    [mockUsers[3]],
    new Date('2026-01-22'),
    undefined,
    false,
    1800
  ),
  createTask(
    'task5',
    'User testing',
    'Conduct user testing sessions and gather feedback',
    'stage4',
    'low',
    [mockUsers[1], mockUsers[3]],
    new Date('2026-01-12'),
    mockUsers[0],
    false,
    10800
  ),
  createTask(
    'task6',
    'Performance optimization',
    'Optimize database queries and improve load times',
    'stage1',
    'medium',
    [mockUsers[2]],
    new Date('2026-01-25'),
    undefined,
    false,
    0
  ),
  createTask(
    'task7',
    'Mobile responsive fixes',
    'Fix layout issues on mobile and tablet devices',
    'stage2',
    'high',
    [mockUsers[1], mockUsers[2]],
    new Date('2026-01-16'),
    mockUsers[0],
    false,
    4500
  ),
  createTask(
    'task8',
    'Security audit',
    'Perform security audit and fix vulnerabilities',
    'stage3',
    'urgent',
    [mockUsers[2]],
    new Date('2026-01-14'),
    mockUsers[0],
    true,
    2700
  )
];

export const mockProjects: Project[] = [
  {
    id: 'project1',
    name: 'TaskFlow Development',
    description: 'Main project for TaskFlow application development',
    status: 'active',
    stages: defaultStages,
    tasks: mockTasks,
    members: mockUsers,
    createdAt: new Date('2026-01-01')
  },
  {
    id: 'project2',
    name: 'Marketing Website',
    description: 'Corporate marketing website redesign',
    status: 'active',
    stages: defaultStages,
    tasks: [],
    members: [mockUsers[0], mockUsers[1], mockUsers[3]],
    createdAt: new Date('2026-01-05')
  },
  {
    id: 'project3',
    name: 'Mobile App',
    description: 'Mobile application development',
    status: 'archived',
    stages: defaultStages,
    tasks: [],
    members: [mockUsers[0], mockUsers[2]],
    createdAt: new Date('2025-12-01')
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    type: 'task_assigned',
    message: 'You were assigned to "Design homepage mockup"',
    read: false,
    timestamp: new Date('2026-01-13T10:30:00'),
    projectId: 'project1',
    taskId: 'task1'
  },
  {
    id: 'notif2',
    type: 'stage_changed',
    message: 'Task "Implement authentication" moved to In Progress',
    read: false,
    timestamp: new Date('2026-01-13T09:15:00'),
    projectId: 'project1',
    taskId: 'task2'
  },
  {
    id: 'notif3',
    type: 'mentioned',
    message: 'You were mentioned in "API documentation"',
    read: true,
    timestamp: new Date('2026-01-12T16:45:00'),
    projectId: 'project1',
    taskId: 'task4'
  },
  {
    id: 'notif4',
    type: 'project_access',
    message: 'You were added to "Marketing Website" project',
    read: true,
    timestamp: new Date('2026-01-12T14:20:00'),
    projectId: 'project2'
  }
];
