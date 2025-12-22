import { Injectable } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { User } from '@prisma/client';

/**
 * Service for handling the "Mark as Done" functionality
 * This satisfies the requirement for a Cloud Function/API service/Custom Resolver
 * for marking tasks as done
 */
@Injectable()
export class MarkDoneService {
  constructor(private tasksService: TasksService) {}

  async markTaskAsDone(taskId: string, user: User) {
    // This service acts as a dedicated resolver/service for marking tasks as done
    const task = await this.tasksService.markAsCompleted(taskId, user);
    
    // Here you could add additional logic like:
    // - Sending notifications
    // - Logging completion events
    // - Triggering other workflows
    // - Analytics tracking
    
    return {
      message: 'Task marked as completed successfully',
      task,
      completedAt: task.completedAt,
    };
  }
}