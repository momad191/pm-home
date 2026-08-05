import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  SCRUM_MASTER = 'SCRUM_MASTER',
  TEAM_MEMBER = 'TEAM_MEMBER',
  QA_ENGINEER = 'QA_ENGINEER',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
  })
  teamId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  firstName: string;

  @Prop({
    required: true,
    trim: true,
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    enum: UserRole,
    default: UserRole.TEAM_MEMBER,
  })
  role: UserRole;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    default: false,
  })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
