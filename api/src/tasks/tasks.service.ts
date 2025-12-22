import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId: user.id,
      },
    });
  }

  async findAll(user: User) {
    return this.prisma.task.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, user: User) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== user.id) {
      throw new ForbiddenException('Access denied to this task');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    await this.findOne(id, user); // This will throw if task doesn't exist or user doesn't have access

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string, user: User) {
    await this.findOne(id, user); // This will throw if task doesn't exist or user doesn't have access

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async markAsCompleted(id: string, user: User) {
    await this.findOne(id, user); // This will throw if task doesn't exist or user doesn't have access

    return this.prisma.task.update({
      where: { id },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    });
  }
}