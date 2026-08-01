import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
}

@Schema({
  timestamps: true,
})
export class Project {
  @Prop({
    required: true,
    unique: true,
  })
  projectId: string;

  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop()
  description: string;

  @Prop()
  year: string;

  @Prop()
  month: string;

  @Prop({
    required: true,
  })
  managerId: string;

  @Prop()
  department: string;

  @Prop({
    type: String,
    enum: [
      ProjectStatus.ACTIVE,
      ProjectStatus.COMPLETED,
      ProjectStatus.ON_HOLD,
      ProjectStatus.PLANNING,
    ],
    default: 'new',
    required: true,
  })
  status: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({
    default: 0,
  })
  completionPercentage: number;

  @Prop({
    default: false,
  })
  isDeleted: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
