import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IncidentSubtypeDocument = IncidentSubtype & Document;

@Schema({ timestamps: true })
export class IncidentSubtype {
  @Prop({ required: true, type: Types.ObjectId, ref: 'IncidentType' })
  incidentType: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const IncidentSubtypeSchema = SchemaFactory.createForClass(IncidentSubtype);
IncidentSubtypeSchema.index({ name: 1, incidentType: 1 }, { unique: true });
