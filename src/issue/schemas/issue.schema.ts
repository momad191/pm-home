import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

export type IssueDocument = Issue & Document;

export enum IssueStatus {
  OPEN = 'OPEN',

  IN_PROGRESS = 'IN_PROGRESS',

  RESOLVED = 'RESOLVED',

  CLOSED = 'CLOSED',
}

export enum IssueSeverity {
  LOW = 'LOW',

  MEDIUM = 'MEDIUM',

  HIGH = 'HIGH',

  CRITICAL = 'CRITICAL',
}

@Schema({
  timestamps: true,
})
export class Issue {
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
  issueId: string;

  @Prop({
    type: Types.ObjectId,

    ref: 'Project',

    required: true,
  })
  projectId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,

    ref: 'Task',

    required: true,
  })
  taskId: Types.ObjectId;

  @Prop({
    enum: IssueStatus,

    default: IssueStatus.OPEN,
  })
  status: IssueStatus;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    type: Types.ObjectId,

    ref: 'User',

    required: true,
  })
  assignedTo: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,

    ref: 'User',

    required: true,
  })
  reportedBy: Types.ObjectId;

  @Prop()
  resolvedAt: Date;

  @Prop()
  closedAt: Date;

  @Prop()
  resolutionNotes: string;

  @Prop({
    enum: IssueSeverity,

    default: IssueSeverity.MEDIUM,
  })
  severity: IssueSeverity;

  @Prop({
    default: false,
  })
  isDeleted: boolean;
}

export const IssueSchema = SchemaFactory.createForClass(Issue);

// IssueSchema.index({
//   issueId: 1,
// });

IssueSchema.index({
  projectId: 1,
});

IssueSchema.index({
  taskId: 1,
});

IssueSchema.index({
  assignedTo: 1,
});

IssueSchema.index({
  status: 1,
});

IssueSchema.index({
  reportedBy: 1,
});

IssueSchema.index({
  severity: 1,
});

IssueSchema.index({
  isDeleted: 1,
});
