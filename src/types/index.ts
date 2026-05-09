import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

export interface TaskWithRelations {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: 'BACKLOG' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  position: number;
  assigneeId: string | null;
  dueDate: Date | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  assignee?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  project?: {
    id: string;
    name: string;
    color: string;
    workspaceId: string;
  };
  _count?: {
    comments: number;
    subtasks: number;
    attachments: number;
  };
}

export interface ProjectWithRelations {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    tasks: number;
  };
}

export interface WorkspaceWithRelations {
  id: string;
  name: string;
  slug: string;
  plan: 'FREE' | 'PRO' | 'TEAM';
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    members: number;
    projects: number;
    tasks: number;
  };
  members?: Array<{
    id: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  }>;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'TASK_UPDATE' | 'TASK_ASSIGNED' | 'TASK_COMMENT' | 'TASK_DUE' | 'MENTION' | 'INVITE';
  read: boolean;
  link: string | null;
  createdAt: Date;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  tasksByStatus: { status: string; count: number }[];
  tasksByPriority: { priority: string; count: number }[];
  recentTasks: TaskWithRelations[];
  upcomingDeadlines: TaskWithRelations[];
}

export interface ActivityItem {
  id: string;
  taskId: string;
  userId: string;
  action: string;
  details: unknown;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface CommentWithUser {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}
