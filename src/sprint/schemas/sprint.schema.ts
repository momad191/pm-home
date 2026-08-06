// sprint/schemas/sprint.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

export type SprintDocument = Sprint & Document;

export enum SprintStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Schema({
  timestamps: true,
})
export class Sprint {
  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
  })
  companyId: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
  })
  sprintId: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop()
  goal: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Project',
    required: true,
  })
  projectId: Types.ObjectId;

  @Prop({
    enum: SprintStatus,
    default: SprintStatus.PLANNED,
  })
  status: SprintStatus;

  @Prop({
    required: true,
  })
  startDate: Date;

  @Prop({
    required: true,
  })
  endDate: Date;

  @Prop({
    default: 0,
  })
  totalTasks: number;

  @Prop({
    default: 0,
  })
  completedTasks: number;

  @Prop({
    default: 0,
  })
  delayedTasks: number;

  @Prop({
    default: 0,
  })
  openIssues: number;

  @Prop({
    default: 0,
  })
  progressPercentage: number;

  @Prop({
    default: false,
  })
  isDeleted: boolean;
}

export const SprintSchema = SchemaFactory.createForClass(Sprint);

// SprintSchema.index({
//   sprintId: 1,
// });

SprintSchema.index({
  projectId: 1,
});

SprintSchema.index({
  status: 1,
});

SprintSchema.index({
  isDeleted: 1,
});
