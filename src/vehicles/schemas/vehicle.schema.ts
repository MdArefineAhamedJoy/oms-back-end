import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Site' })
  site: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  checkedInBy: Types.ObjectId;

  @Prop({ required: true, unique: true })
  registrationNumber: string;

  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  ownerName: string;

  @Prop({ required: true })
  contactNumber: string;

  @Prop({ required: true, type: Date })
  checkInTime: Date;

  @Prop({ type: Date })
  checkOutTime: Date;

  @Prop({
    enum: ['PARKED', 'EXITED', 'OVERDUE'],
    default: 'PARKED',
  })
  parkingStatus: string;

  @Prop()
  notes: string;

  @Prop()
  parkingSpot: string;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
VehicleSchema.index({ registrationNumber: 1 }, { unique: true });
VehicleSchema.index({ site: 1, checkInTime: -1 });
VehicleSchema.index({ parkingStatus: 1 });
