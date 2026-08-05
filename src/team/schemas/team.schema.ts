import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

export type TeamDocument = Team & Document;

export enum TeamStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({
  timestamps: true,
})
export class Team {
  @Prop({
    unique: true,
    required: true,
    index: true,
  })
  teamId: string;

  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    trim: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  department: string;

  @Prop({
    enum: TeamStatus,
    default: TeamStatus.ACTIVE,
  })
  status: TeamStatus;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  teamLead: Types.ObjectId;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
    default: [],
  })
  members: Types.ObjectId[];

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Project',
      },
    ],
    default: [],
  })
  projects: Types.ObjectId[];

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Task',
      },
    ],
    default: [],
  })
  tasks: Types.ObjectId[];

  @Prop({
    default: 0,
  })
  totalProjects: number;

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
  completionPercentage: number;

  @Prop({
    default: false,
  })
  isDeleted: boolean;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.index({
  name: 1,
});

TeamSchema.index({
  department: 1,
});

TeamSchema.index({
  status: 1,
});

TeamSchema.index({
  teamLead: 1,
});

TeamSchema.index({
  members: 1,
});

TeamSchema.index({
  projects: 1,
});

TeamSchema.index({
  tasks: 1,
});

TeamSchema.index({
  isDeleted: 1,
});

TeamSchema.index({
  createdAt: -1,
});
