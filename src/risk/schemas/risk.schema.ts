import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

export type RiskDocument = Risk & Document;

export enum RiskLevel {
  LOW = 'LOW',

  MEDIUM = 'MEDIUM',

  HIGH = 'HIGH',
}

export enum RiskStatus {
  OPEN = 'OPEN',

  IN_PROGRESS = 'IN_PROGRESS',

  MITIGATED = 'MITIGATED',

  CLOSED = 'CLOSED',
}

@Schema({
  timestamps: true,
})
export class Risk {
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
  riskId: string;

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
    enum: RiskLevel,

    required: true,
  })
  level: RiskLevel;

  @Prop({
    required: true,
  })
  description: string;

  @Prop()
  mitigationPlan: string;

  @Prop({
    enum: RiskStatus,

    default: RiskStatus.OPEN,
  })
  status: RiskStatus;

  @Prop({
    default: false,
  })
  isDeleted: boolean;
}

export const RiskSchema = SchemaFactory.createForClass(Risk);

// RiskSchema.index({
//   riskId: 1,
// });

RiskSchema.index({
  projectId: 1,
});

RiskSchema.index({
  taskId: 1,
});

RiskSchema.index({
  level: 1,
});

RiskSchema.index({
  status: 1,
});

RiskSchema.index({
  isDeleted: 1,
});
