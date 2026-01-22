import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentSubtypesService } from './incident-subtypes.service';
import { IncidentSubtypesController } from './incident-subtypes.controller';
import { IncidentSubtype, IncidentSubtypeSchema } from './schemas/incident-subtype.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IncidentSubtype.name, schema: IncidentSubtypeSchema },
    ]),
  ],
  providers: [IncidentSubtypesService],
  controllers: [IncidentSubtypesController],
})
export class IncidentSubtypesModule {}
