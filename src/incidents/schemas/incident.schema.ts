import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IncidentDocument = Incident & Document;

@Schema({ timestamps: true })
export class Incident {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Tenant' })
  tenant: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Site' })
  site: Types.ObjectId;

  @Prop({ required: true, unique: true })
  incidentNumber: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserProfile' })
  reportedBy: Types.ObjectId;

  @Prop({ required: true })
  incidentType: string;

  @Prop({ required: true })
  subType: string;

  @Prop({
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM',
  })
  severity: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Date })
  incidentTime: Date;

  @Prop({ required: true })
  location: string;

  @Prop({
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
  })
  coordinates: { lat: number; lng: number };

  @Prop({
    type: [{
      name: { type: String },
      contact: { type: String },
    }],
  })
  witnesses: Array<{ name: string; contact: string }>;

  @Prop({ default: false })
  injuries: boolean;

  @Prop({ default: false })
  propertyDamage: boolean;

  @Prop({ default: false })
  emergencyServicesNotified: boolean;

  @Prop({
    enum: ['REPORTED', 'INVESTIGATING', 'RESOLVED', 'CLOSED'],
    default: 'REPORTED',
  })
  incidentStatus: string;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  assignedTo: Types.ObjectId;

  @Prop({
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM',
  })
  priority: string;

  @Prop({ type: Date })
  resolvedAt: Date;

  @Prop()
  resolutionNotes: string;

  @Prop({ default: true })
  clientVisible: boolean;

  @Prop({
    type: [String],
  })
  photos: string[];

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);
IncidentSchema.index({ incidentNumber: 1 }, { unique: true });
IncidentSchema.index({ site: 1, incidentTime: -1 });
IncidentSchema.index({ incidentStatus: 1 });
IncidentSchema.index({ severity: 1 });
IncidentSchema.index { coordinates: '2dsphere' });
