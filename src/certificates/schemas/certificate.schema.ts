import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CertificateDocument = Certificate & Document;

@Schema({ timestamps: true })
export class Certificate {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Date })
  expiryDate: Date;

  @Prop({ type: [String] })
  attachement: string[];

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  user_profile: Types.ObjectId;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
