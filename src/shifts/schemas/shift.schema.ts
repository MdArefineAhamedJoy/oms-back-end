import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ShiftDocument = Shift & Document;

@Schema({ timestamps: true })
export class Shift {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Tenant' })
  tenant: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Site' })
  site: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserProfile' })
  user: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'ShiftType' })
  shiftType: Types.ObjectId;

  @Prop({ required: true, type: Date })
  shiftDate: Date;

  @Prop({ required: true, type: Date })
  startTime: Date;

  @Prop({ required: true, type: Date })
  endTime: Date;

  @Prop()
  dutyPost: string;

  @Prop({ type: Date })
  checkInTime: Date;

  @Prop({
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
  })
  checkInLocation: { lat: number; lng: number };

  @Prop({ type: Date })
  checkOutTime: Date;

  @Prop({
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
  })
  checkOutLocation: { lat: number; lng: number };

  @Prop({ default: 0 })
  overtimeMinutes: number;

  @Prop({
    enum: ['SCHEDULED', 'ONGOING', 'COMPLETED', 'MISSED'],
    default: 'SCHEDULED',
  })
  shiftStatus: string;

  @Prop()
  notes: string;

  @Prop({ default: 0 })
  requiredStaff: number;

  @Prop()
  checkInPhoto: string;

  @Prop()
  checkOutPhoto: string;

  @Prop()
  checkInNote: string;

  @Prop()
  checkOutNote: string;

  @Prop({
    enum: ['TRAFFIC', 'TRANSPORT_DELAY', 'WEATHER', 'ILLNESS', 'PERSONAL_EMERGENCY', 'OTHER'],
  })
  lateArrivalReason: string;

  @Prop()
  lateArrivalNote: string;

  @Prop({ default: false })
  postConfirmed: boolean;

  @Prop()
  postConfirmationNote: string;

  @Prop({ type: Date })
  breakStartTime: Date;

  @Prop({ type: Date })
  breakEndTime: Date;

  @Prop({ default: false })
  manualAdjustment: boolean;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  adjustedBy: Types.ObjectId;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);
ShiftSchema.index({ shiftDate: 1, user: 1, site: 1 });
ShiftSchema.index({ shiftStatus: 1 });
ShiftSchema.index({ checkInTime: 1 });
