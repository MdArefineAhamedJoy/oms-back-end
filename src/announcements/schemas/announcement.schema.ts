import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnnouncementDocument = Announcement & Document;

@Schema({ timestamps: true })
export class Announcement {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  userProfile: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Tenant' })
  tenant: Types.ObjectId;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
