import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GeofenceOverridesService } from './geofence-overrides.service';
import { GeofenceOverridesController } from './geofence-overrides.controller';
import { GeofenceOverride, GeofenceOverrideSchema } from './schemas/geofence-override.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: GeofenceOverride.name, schema: GeofenceOverrideSchema }])],
  providers: [GeofenceOverridesService],
  controllers: [GeofenceOverridesController],
})
export class GeofenceOverridesModule {}
