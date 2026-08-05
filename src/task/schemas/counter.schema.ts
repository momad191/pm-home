import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskCounterDocument = TaskCounter & Document;

@Schema()
export class TaskCounter {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: 999 })
  seq: number;
}

export const TaskCounterSchema = SchemaFactory.createForClass(TaskCounter);
