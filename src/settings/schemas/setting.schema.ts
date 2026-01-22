import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema({ timestamps: true })
export class Setting {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ unique: true, required: true })
  key: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  value: any;

  @Prop({ required: true })
  category: string;

  @Prop()
  description: string;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
SettingSchema.index({ tenantId: 1, key: 1 }, { unique: true });
