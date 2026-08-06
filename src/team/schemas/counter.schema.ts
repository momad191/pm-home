import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamCounterDocument = TeamCounter & Document;

@Schema()
export class TeamCounter {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: 999 })
  seq: number;
}

export const TeamCounterSchema = SchemaFactory.createForClass(TeamCounter);
