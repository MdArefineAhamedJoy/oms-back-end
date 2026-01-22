import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  contactPerson: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: false })
  address: string;

  @Prop({
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    required: true,
    default: 'ACTIVE',
  })
  clientStatus: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

// Add indexes
ClientSchema.index({ tenantId: 1 });
ClientSchema.index({ email: 1 }, { unique: true, sparse: true });
ClientSchema.index({ name: 1 });
