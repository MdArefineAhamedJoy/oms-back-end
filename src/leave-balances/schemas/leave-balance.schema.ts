import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeaveBalanceDocument = LeaveBalance & Document;

@Schema({ timestamps: true })
export class LeaveBalance {
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserProfile' })
  userProfile: Types.ObjectId;

  @Prop({ default: 14 })
  annualBalance: number;

  @Prop({ default: 14 })
  sickBalance: number;

  @Prop({ default: 3 })
  otherBalance: number;

  @Prop({ required: true, type: Number })
  year: number;

  @Prop({ default: 0 })
  carriedForward: number;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const LeaveBalanceSchema = SchemaFactory.createForClass(LeaveBalance);
LeaveBalanceSchema.index({ userProfile: 1, year: 1 }, { unique: true });
LeaveBalanceSchema.index({ year: 1 });
