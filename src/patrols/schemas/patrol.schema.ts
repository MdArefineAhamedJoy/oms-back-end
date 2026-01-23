import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PatrolDocument = Patrol & Document;

@Schema({ timestamps: true })
export class Patrol {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Tenant' })
  tenant: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Site' })
  site: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserProfile' })
  user: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Shift' })
  shift: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PatrolRoute' })
  patrolRoute: Types.ObjectId;

  @Prop({ required: true, type: Date })
  startTime: Date;

  @Prop({ type: Date })
  endTime: Date;

  @Prop({
    enum: ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'],
    default: 'IN_PROGRESS',
  })
  patrolStatus: string;

  @Prop({
    enum: ['ONGOING', 'COMPLETED'],
  })
  patrolExecutionStatus: string;

  @Prop({ default: 0 })
  totalScans: number;

  @Prop({ default: 0 })
  missedScans: number;

  @Prop()
  notes: string;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const PatrolSchema = SchemaFactory.createForClass(Patrol);
PatrolSchema.index({ shift: 1, user: 1, startTime: 1 });
PatrolSchema.index({ patrolStatus: 1 });
PatrolSchema.index({ site: 1, startTime: -1 });
