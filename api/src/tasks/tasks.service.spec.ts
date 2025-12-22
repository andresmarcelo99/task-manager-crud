import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    cognitoId: 'cognito-123',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
  };

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
      };

      mockPrismaService.task.create.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto, mockUser);

      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: {
          ...createTaskDto,
          userId: mockUser.id,
        },
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a user', async () => {
      const mockTasks = [mockTask];
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);

      const result = await service.findAll(mockUser);

      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockTasks);
    });
  });

  describe('findOne', () => {
    it('should return a task when found and user has access', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);

      const result = await service.findOne('task-1', mockUser);

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user does not have access', async () => {
      const otherUserTask = { ...mockTask, userId: 'other-user' };
      mockPrismaService.task.findUnique.mockResolvedValue(otherUserTask);

      await expect(service.findOne('task-1', mockUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('markAsCompleted', () => {
    it('should mark a task as completed', async () => {
      const completedTask = {
        ...mockTask,
        completed: true,
        completedAt: new Date(),
      };

      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);
      mockPrismaService.task.update.mockResolvedValue(completedTask);

      const result = await service.markAsCompleted('task-1', mockUser);

      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: 'task-1' },
        data: {
          completed: true,
          completedAt: expect.any(Date),
        },
      });
      expect(result.completed).toBe(true);
      expect(result.completedAt).toBeDefined();
    });
  });
});