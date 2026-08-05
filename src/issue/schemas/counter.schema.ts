import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProjectCounter } from 'src/project/schemas/counter.schema';

export type IssueCounterDocument = IssueCounter & Document;

@Schema()
export class IssueCounter {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: 999 })
  seq: number;
}

export const IssueCounterSchema = SchemaFactory.createForClass(IssueCounter);
