import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeaveRequestDocument = LeaveRequest & Document;

@Schema({ timestamps: true })
export class LeaveRequest {
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserProfile' })
  user: Types.ObjectId;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;

  @Prop({
    enum: ['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'COMPASSIONATE', 'UNPAID'],
    required: true,
  })
  leaveType: string;

  @Prop({ required: true })
  reason: string;

  @Prop({
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING',
  })
  requestStatus: string;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  approvedBy: Types.ObjectId;

  @Prop({ type: Date })
  approvedAt: Date;

  @Prop()
  rejectionReason: string;

  @Prop({ default: 1 })
  totalDays: number;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const LeaveRequestSchema = SchemaFactory.createForClass(LeaveRequest);
LeaveRequestSchema.index({ user: 1, startDate: -1 });
LeaveRequestSchema.index({ requestStatus: 1 });
LeaveRequestSchema.index({ leaveType: 1 });
LeaveRequestSchema.index({ startDate: 1, endDate: 1 });
