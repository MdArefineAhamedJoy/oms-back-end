import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class OccurrenceHistory {
  @Prop({ required: true })
  originalDocumentId: string;

  @Prop({ type: String })
  entryNumber: string;

  @Prop({ required: true, type: Object })
  snapshot: Record<string, any>;

  @Prop({ type: String })
  archivedReason: string;

  @Prop({ required: true, type: Date })
  archivedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Tenant' })
  tenant: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  archivedBy: Types.ObjectId;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type OccurrenceHistoryDocument = OccurrenceHistory & Document;

export const OccurrenceHistorySchema = SchemaFactory.createForClass(OccurrenceHistory);

OccurrenceHistorySchema.index({ originalDocumentId: 1 });
OccurrenceHistorySchema.index({ tenant: 1, archivedAt: -1 });
OccurrenceHistorySchema.index({ entryNumber: 1 });
