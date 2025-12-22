import apiClient from './authService';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export const TaskPriorityEnum = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type TaskPriority = typeof TaskPriorityEnum[keyof typeof TaskPriorityEnum];

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority: TaskPriority;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
  priotity?: TaskPriority;
}

export const tasksAPI = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData: CreateTaskDto): Promise<Task> => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id: string, taskData: UpdateTaskDto): Promise<Task> => {
    const response = await apiClient.patch(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },

  markTaskAsDone: async (id: string): Promise<{ message: string; task: Task; completedAt?: string }> => {
    const response = await apiClient.post(`/tasks/${id}/mark-done`);
    return response.data;
  },
};