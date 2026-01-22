import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentTypesService } from './incident-types.service';
import { IncidentTypesController } from './incident-types.controller';
import { IncidentType, IncidentTypeSchema } from './schemas/incident-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IncidentType.name, schema: IncidentTypeSchema },
    ]),
  ],
  providers: [IncidentTypesService],
  controllers: [IncidentTypesController],
})
export class IncidentTypesModule {}
