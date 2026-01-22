import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TenantDocument = Tenant & Document;

@Schema({ timestamps: true })
export class Tenant {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  tenantCode: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, unique: true })
  licenseNumber: string;

  @Prop({
    type: String,
    enum: ['BASIC', 'STANDARD', 'PREMIUM'],
    default: 'BASIC',
  })
  subscriptionPlan: string;

  @Prop({ default: 10 })
  maxSites: number;

  @Prop({ default: 100 })
  maxUsers: number;

  @Prop({ type: Object })
  settings: Record<string, any>;

  @Prop({
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    required: true,
    default: 'ACTIVE',
  })
  tenantStatus: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
