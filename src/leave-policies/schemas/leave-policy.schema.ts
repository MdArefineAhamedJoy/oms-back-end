import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeavePolicyDocument = LeavePolicy & Document;

@Schema({ timestamps: true })
export class LeavePolicy {
  @Prop({ required: true })
  tenantId: string;

  @Prop({
    enum: ['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'COMPASSIONATE', 'UNPAID'],
    required: true,
  })
  leaveType: string;

  @Prop({ default: 14 })
  maxDaysPerYear: number;

  @Prop({ default: 14 })
  maxConsecutiveDays: number;

  @Prop({ default: true })
  requiresApproval: boolean;

  @Prop({ default: 7 })
  noticeDaysRequired: number;

  @Prop({ default: false })
  carryForwardAllowed: boolean;

  @Prop({ default: 0 })
  maxCarryForwardDays: number;

  @Prop({ type: Object })
  rules: Record<string, any>;

  @Prop({ default: true })
  isActive: boolean;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const LeavePolicySchema = SchemaFactory.createForClass(LeavePolicy);
LeavePolicySchema.index({ tenantId: 1, leaveType: 1 }, { unique: true });
