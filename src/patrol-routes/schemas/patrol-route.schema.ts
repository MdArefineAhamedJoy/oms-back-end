import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PatrolRouteDocument = PatrolRoute & Document;

@Schema({ timestamps: true })
export class PatrolRoute {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Site' })
  site: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({
    type: {
      distance: { type: Number },
      estimatedTime: { type: Number },
      checkpoints: [{ type: String }],
    },
  })
  routeData: {
    distance: number;
    estimatedTime: number;
    checkpoints: string[];
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  priorityOrder: number;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const PatrolRouteSchema = SchemaFactory.createForClass(PatrolRoute);
PatrolRouteSchema.index({ name: 1, site: 1 }, { unique: true });
