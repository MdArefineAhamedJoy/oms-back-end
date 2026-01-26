import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppVersionDocument = AppVersion & Document;

@Schema({ timestamps: true })
export class AppVersion {
  @Prop({ required: true, unique: true, maxlength: 20 })
  version: string;

  @Prop({ required: true, unique: true, maxlength: 64 })
  commitHash: string;

  @Prop({ type: String })
  notes: string;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const AppVersionSchema = SchemaFactory.createForClass(AppVersion);

AppVersionSchema.index({ version: 1 }, { unique: true });
AppVersionSchema.index({ commitHash: 1 }, { unique: true });
