import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  DELAY = 'DELAY',

  HIGH_RISK = 'HIGH_RISK',

  OPEN_ISSUE = 'OPEN_ISSUE',

  DEADLINE = 'DEADLINE',

  LOW_COMPLETION = 'LOW_COMPLETION',

  TASK_ASSIGNED = 'TASK_ASSIGNED',

  TASK_COMPLETED = 'TASK_COMPLETED',

  ISSUE_RESOLVED = 'ISSUE_RESOLVED',

  PROJECT_CREATED = 'PROJECT_CREATED',

  SPRINT_STARTED = 'SPRINT_STARTED',
}

export enum NotificationReferenceType {
  PROJECT = 'PROJECT',

  SPRINT = 'SPRINT',

  TASK = 'TASK',

  RISK = 'RISK',

  ISSUE = 'ISSUE',
}

export enum NotificationPriority {
  LOW = 'LOW',

  NORMAL = 'NORMAL',

  HIGH = 'HIGH',

  URGENT = 'URGENT',
}

export enum NotificationSource {
  SYSTEM = 'SYSTEM',

  PROJECT = 'PROJECT',

  TASK = 'TASK',

  SPRINT = 'SPRINT',

  ISSUE = 'ISSUE',

  RISK = 'RISK',

  AUTH = 'AUTH',
}

@Schema({
  timestamps: true,
})
export class Notification {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    maxlength: 500,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 1000,
  })
  message: string;

  @Prop({
    enum: NotificationType,
    required: true,
  })
  type: NotificationType;

  @Prop({
    default: false,
  })
  isRead: boolean;

  @Prop({
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    type: Types.ObjectId,
  })
  referenceId?: Types.ObjectId;

  @Prop({
    enum: NotificationReferenceType,
  })
  referenceType?: NotificationReferenceType;

  @Prop({
    trim: true,
  })
  actionUrl?: string;

  @Prop({
    default: false,
  })
  isArchived: boolean;

  @Prop({
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    },
  })
  expiresAt?: Date;

  @Prop({
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL,
  })
  priority: NotificationPriority;

  @Prop({
    enum: NotificationSource,
    default: NotificationSource.SYSTEM,
  })
  source: NotificationSource;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// NotificationSchema.index({
//   userId: 1,
// });

NotificationSchema.index({
  type: 1,
});

NotificationSchema.index({
  isRead: 1,
});

NotificationSchema.index({
  isDeleted: 1,
});

NotificationSchema.index({
  createdAt: -1,
});

NotificationSchema.index({
  referenceId: 1,
});

NotificationSchema.index({
  referenceType: 1,
});

NotificationSchema.index({
  isArchived: 1,
});

NotificationSchema.index({
  userId: 1,
  isRead: 1,
});

NotificationSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

NotificationSchema.index({
  userId: 1,
  createdAt: -1,
});

NotificationSchema.index({
  userId: 1,
  isArchived: 1,
});

NotificationSchema.index({
  userId: 1,
  priority: 1,
});

NotificationSchema.index({
  userId: 1,
  type: 1,
});
