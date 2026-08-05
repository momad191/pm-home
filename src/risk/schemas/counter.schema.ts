import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RiskCounterDocument = RiskCounter & Document;

@Schema()
export class RiskCounter {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: 999 })
  seq: number;
}

export const RiskCounterSchema = SchemaFactory.createForClass(RiskCounter);
