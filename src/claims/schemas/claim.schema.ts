import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClaimDocument = Claim & Document;

@Schema({ timestamps: true })
export class Claim {
  @Prop({ required: true, type: Date })
  expenseDate: Date;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true })
  purpose: string;

  @Prop({ type: [String] })
  attachment: string[];

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  claimStatus: string;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  actionBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  user: Types.ObjectId;

  @Prop({ type: Object })
  category: Record<string, any>;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);
