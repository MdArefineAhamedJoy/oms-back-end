import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class PaySlip {
  @Prop({ required: true, enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] })
  month: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true, type: Date })
  payDate: Date;

  @Prop({ type: Number })
  allowance: number;

  @Prop({ required: true, type: Number })
  netSalary: number;

  @Prop({ required: true, type: Number })
  basicSalary: number;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  user: Types.ObjectId;

  @Prop({ type: Array })
  additionalTransactions: any[];

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type PaySlipDocument = PaySlip & Document;

export const PaySlipSchema = SchemaFactory.createForClass(PaySlip);

PaySlipSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });
PaySlipSchema.index({ year: -1, month: 1 });
PaySlipSchema.index({ payDate: -1 });
