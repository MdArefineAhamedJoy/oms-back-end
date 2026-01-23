import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VisitorDocument = Visitor & Document;

@Schema({ timestamps: true })
export class Visitor {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Site' })
  site: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  checkedInBy: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  identificationNumber: string;

  @Prop({
    enum: ['WALK_IN', 'SCHEDULED', 'DELIVERY', 'CONTRACTOR', 'INTERVIEW'],
    required: true,
  })
  visitorType: string;

  @Prop({ required: true, type: Date })
  checkInTime: Date;

  @Prop({ type: Date })
  checkOutTime: Date;

  @Prop({ required: true })
  purpose: string;

  @Prop({ required: true })
  host: string;

  @Prop()
  notes: string;

  @Prop()
  signature: string;

  @Prop()
  photo: string;

  @Prop({
    enum: ['CHECKED_IN', 'CHECKED_OUT', 'OVERDUE'],
    default: 'CHECKED_IN',
  })
  status: string;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);
VisitorSchema.index({ site: 1, checkInTime: -1 });
VisitorSchema.index({ identificationNumber: 1, checkInTime: -1 });
VisitorSchema.index({ status: 1 });
