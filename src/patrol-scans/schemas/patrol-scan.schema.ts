import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PatrolScanDocument = PatrolScan & Document;

@Schema({ timestamps: true })
export class PatrolScan {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Patrol' })
  patrol: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Checkpoint' })
  checkpoint: Types.ObjectId;

  @Prop({ required: true, type: Date })
  scanTime: Date;

  @Prop({
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
    required: true,
  })
  location: { lat: number; lng: number };

  @Prop()
  notes: string;

  @Prop()
  scanPhoto: string;

  @Prop({ default: false })
  isMissed: boolean;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const PatrolScanSchema = SchemaFactory.createForClass(PatrolScan);
PatrolScanSchema.index({ patrol: 1, scanTime: 1 });
PatrolScanSchema.index({ checkpoint: 1 });
PatrolScanSchema.index({ location: '2dsphere' });
