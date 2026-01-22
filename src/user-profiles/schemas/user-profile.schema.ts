import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserProfileDocument = UserProfile & Document;

@Schema({ timestamps: true })
export class UserProfile {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  employeeId: string;

  @Prop({ required: true })
  phone: string;

  @Prop({
    enum: ['SUPER_ADMIN', 'OM', 'OFFICER', 'CLIENT'],
    required: true,
  })
  role: string;

  @Prop({
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE',
  })
  userStatus: string;

  @Prop()
  lastLogin: Date;

  @Prop({ default: 0 })
  failedAttempts: number;

  @Prop()
  lockedUntil: Date;

  @Prop({ type: Object })
  permissions: Record<string, any>;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  hiredDate: Date;

  @Prop()
  address: string;

  @Prop()
  emergencyContact: string;

  @Prop()
  emergencyPhone: string;

  @Prop()
  profilePhoto: string;

  @Prop({ default: [] })
  siteIds: string[];

  @Prop()
  clientId: string;

  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
UserProfileSchema.index({ tenantId: 1 });
UserProfileSchema.index({ employeeId: 1 });
UserProfileSchema.index({ phone: 1 });
