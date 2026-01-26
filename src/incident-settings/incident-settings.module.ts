import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentSettingsService } from './incident-settings.service';
import { IncidentSettingsController } from './incident-settings.controller';
import { IncidentSetting, IncidentSettingSchema } from './schemas/incident-setting.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: IncidentSetting.name, schema: IncidentSettingSchema }])],
  providers: [IncidentSettingsService],
  controllers: [IncidentSettingsController],
})
export class IncidentSettingsModule {}
