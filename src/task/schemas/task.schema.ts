// task/schemas/task.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  TESTING = 'TESTING',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Schema({
  timestamps: true,
})
export class Task {
  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
  })
  companyId: Types.ObjectId;

  @Prop({
    required: false,
    unique: true,
  })
  taskId: string;

  @Prop({
    required: true,
  })
  title: string;

  @Prop()
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Project',
    required: true,
  })
  projectId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Sprint',
    required: true,
  })
  sprintId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  assignedTo: Types.ObjectId;

  @Prop({
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Prop({
    enum: TaskStatus,
    default: TaskStatus.BACKLOG,
  })
  status: TaskStatus;

  @Prop({
    default: 0,
  })
  storyPoints: number;

  @Prop()
  dueDate: Date;

  @Prop({
    default: 0,
  })
  estimatedHours: number;

  @Prop({
    default: 0,
  })
  actualHours: number;

  @Prop({
    default: false,
  })
  isDeleted: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// TaskSchema.index({
//   taskId: 1,
// });

TaskSchema.index({
  projectId: 1,
});

TaskSchema.index({
  sprintId: 1,
});

TaskSchema.index({
  assignedTo: 1,
});

TaskSchema.index({
  status: 1,
});

TaskSchema.index({
  priority: 1,
});

TaskSchema.index({
  isDeleted: 1,
});
