import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShiftTypeDocument = ShiftType & Document;

@Schema({ timestamps: true })
export class ShiftType {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ default: 1 })
  requiredStaff: number;

  @Prop({ type: Object })
  breakConfig: { duration: number; paid: boolean };

  @Prop({ default: true })
  isActive: boolean;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const ShiftTypeSchema = SchemaFactory.createForClass(ShiftType);
ShiftTypeSchema.index({ tenantId: 1 });
