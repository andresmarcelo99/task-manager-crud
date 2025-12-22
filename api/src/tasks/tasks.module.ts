import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MarkDoneService } from './mark-done.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, MarkDoneService],
  exports: [TasksService],
})
export class TasksModule {}