import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CheckpointDocument = Checkpoint & Document;

@Schema({ timestamps: true })
export class Checkpoint {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Site' })
  site: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
    required: true,
  })
  location: { lat: number; lng: number };

  @Prop({ required: true, unique: true })
  qrCode: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  priorityOrder: number;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const CheckpointSchema = SchemaFactory.createForClass(Checkpoint);
CheckpointSchema.index({ name: 1, site: 1 }, { unique: true });
CheckpointSchema.index({ location: '2dsphere' });
