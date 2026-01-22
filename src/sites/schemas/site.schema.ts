import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteDocument = Site & Document;

@Schema({ timestamps: true })
export class Site {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  siteCode: string;

  @Prop({ required: true })
  address: string;

  @Prop({
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: true,
  })
  coordinates: { lat: number; lng: number };

  @Prop({ default: 100 })
  geofenceRadius: number;

  @Prop({ default: 'Asia/Singapore' })
  timezone: string;

  @Prop({ type: Object, required: false })
  settings: Record<string, any>;

  @Prop({
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    required: true,
    default: 'ACTIVE',
  })
  siteStatus: string;
}

export const SiteSchema = SchemaFactory.createForClass(Site);

// Add indexes
SiteSchema.index({ tenantId: 1 });
SiteSchema.index({ siteCode: 1 }, { unique: true, sparse: true });
SiteSchema.index({ name: 1 });
