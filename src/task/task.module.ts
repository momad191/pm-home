import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Task, TaskSchema } from './schemas/task.schema';

import { TaskService } from './task.service';
import { TaskController } from './task.controller';

import { TaskCounter, TaskCounterSchema } from './schemas/counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
      {
        name: TaskCounter.name,
        schema: TaskCounterSchema,
      },
    ]),
  ],

  controllers: [TaskController],

  providers: [TaskService],

  exports: [TaskService],
})
export class TaskModule {}
