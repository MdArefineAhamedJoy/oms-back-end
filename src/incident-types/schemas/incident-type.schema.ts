import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IncidentTypeDocument = IncidentType & Document;

@Schema({ timestamps: true })
export class IncidentType {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  priorityOrder: number;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const IncidentTypeSchema = SchemaFactory.createForClass(IncidentType);
IncidentTypeSchema.index({ name: 1 }, { unique: true });
