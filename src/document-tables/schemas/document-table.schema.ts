import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DocumentTableDocument = DocumentTable & Document;

@Schema({ timestamps: true })
export class DocumentTable {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  attachment: string[];

  @Prop({ type: Boolean, default: false })
  isGuard: boolean;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' })
  users_permissions_user: Types.ObjectId;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const DocumentTableSchema = SchemaFactory.createForClass(DocumentTable);
