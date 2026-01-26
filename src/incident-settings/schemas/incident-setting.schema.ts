import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IncidentSettingDocument = IncidentSetting & Document;

@Schema({ timestamps: true })
export class IncidentSetting {
  @Prop({ type: Object, default: null })
  severityOptions: Record<string, any>;

  @Prop({ type: Object, default: null })
  priorityOptions: Record<string, any>;

  @Prop({ type: Object, default: null })
  statusOptions: Record<string, any>;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const IncidentSettingSchema = SchemaFactory.createForClass(IncidentSetting);
