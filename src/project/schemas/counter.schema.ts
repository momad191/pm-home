import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectCounterDocument = ProjectCounter & Document;

@Schema()
export class ProjectCounter {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: 999 })
  seq: number;
}

export const ProjectCounterSchema =
  SchemaFactory.createForClass(ProjectCounter);
