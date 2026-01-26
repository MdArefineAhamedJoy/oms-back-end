import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GeofenceOverrideDocument = GeofenceOverride & Document;

@Schema({ timestamps: true })
export class GeofenceOverride {
  @Prop({ type: Types.ObjectId, ref: 'Tenant' })
  tenant: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Shift' })
  shift: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Site' })
  site: Types.ObjectId;

  @Prop({ required: true, enum: ['CHECK_IN', 'CHECK_OUT'] })
  overrideType: string;

  @Prop({ required: true, enum: ['EMERGENCY', 'PARKING', 'TECHNICAL_ISSUE', 'OTHER'] })
  reason: string;

  @Prop({ type: String })
  reasonDetails: string;

  @Prop({ required: true, type: Number, min: 0 })
  distance: number;

  @Prop({ required: true, type: Object })
  userLocation: Record<string, any>;

  @Prop({ required: true, type: Object })
  siteLocation: Record<string, any>;

  @Prop({ required: true, enum: ['PENDING', 'AUTO_APPROVED', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  overrideStatus: string;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  approvedBy: Types.ObjectId;

  @Prop({ type: String })
  approvalNotes: string;

  @Prop({ type: Date })
  approvedAt: Date;

  @Prop({ type: String, maxlength: 50 })
  ipAddress: string;

  @Prop({ type: Object })
  deviceInfo: Record<string, any>;

  @Prop({ type: String, maxlength: 500 })
  userAgent: string;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const GeofenceOverrideSchema = SchemaFactory.createForClass(GeofenceOverride);
GeofenceOverrideSchema.index({ tenant: 1, site: 1, user: 1, createdAt: -1 });
GeofenceOverrideSchema.index({ overrideStatus: 1 });
GeofenceOverride.index({ overrideType: 1 });
