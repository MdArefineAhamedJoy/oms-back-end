import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum EntryType {
  ROUTINE = 'ROUTINE',
  INCIDENT = 'INCIDENT',
  VISITOR = 'VISITOR',
  PATROL = 'PATROL',
  HANDOVER = 'HANDOVER',
  OTHERS = 'OTHERS',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum AcknowledgmentStatus {
  PENDING = 'PENDING',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
}

export enum FollowUpStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Schema({ timestamps: true })
export class OccurrenceBook {
  @Prop({ type: Types.ObjectId, ref: 'Tenant' })
  tenant: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Site' })
  site: Types.ObjectId;

  @Prop({ required: true, maxlength: 50 })
  entryNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Shift' })
  shift: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  user: Types.ObjectId;

  @Prop({ required: true, enum: EntryType })
  entryType: EntryType;

  @Prop({ required: true, maxlength: 255 })
  subject: string;

  @Prop({ required: true, type: Object })
  content: Record<string, any>;

  @Prop({ required: true, enum: Priority })
  priority: Priority;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  assignedTo: Types.ObjectId;

  @Prop({ required: true, default: false })
  acknowledgmentRequired: boolean;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  acknowledgedBy: Types.ObjectId;

  @Prop({ type: Date })
  acknowledgedAt: Date;

  @Prop({ enum: AcknowledgmentStatus, default: null })
  acknowledgmentStatus: AcknowledgmentStatus | null;

  @Prop({ required: true, default: false })
  followUpRequired: boolean;

  @Prop({ enum: FollowUpStatus })
  followUpStatus: FollowUpStatus;

  @Prop({ type: Types.ObjectId, ref: 'Incident' })
  linkedIncident: Types.ObjectId;

  @Prop({ type: Array, default: [] })
  assignmentTrail: any[];

  @Prop({ required: true, default: false })
  archived: boolean;

  @Prop({ type: String })
  archivedReason: string;

  @Prop({ type: Date })
  archivedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  archivedBy: Types.ObjectId;

  @Prop({ type: String })
  supervisorReview: string;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  reviewedBy: Types.ObjectId;

  @Prop({ type: Date })
  reviewedAt: Date;

  @Prop({ type: [String] })
  attachments: string[];

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type OccurrenceBookDocument = OccurrenceBook & Document;

export const OccurrenceBookSchema = SchemaFactory.createForClass(OccurrenceBook);

OccurrenceBookSchema.index({ tenant: 1, site: 1, entryNumber: 1 }, { unique: true });
OccurrenceBookSchema.index({ tenant: 1, site: 1, createdAt: -1 });
OccurrenceBookSchema.index({ entryType: 1 });
OccurrenceBookSchema.index({ priority: 1 });
OccurrenceBookSchema.index({ acknowledgmentStatus: 1 });
OccurrenceBookSchema.index({ followUpStatus: 1 });
