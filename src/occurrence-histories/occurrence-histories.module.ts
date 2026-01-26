import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OccurrenceHistoriesService } from './occurrence-histories.service';
import { OccurrenceHistoriesController } from './occurrence-histories.controller';
import { OccurrenceHistory, OccurrenceHistorySchema } from './schemas/occurrence-history.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: OccurrenceHistory.name, schema: OccurrenceHistorySchema }])],
  controllers: [OccurrenceHistoriesController],
  providers: [OccurrenceHistoriesService],
  exports: [OccurrenceHistoriesService],
})
export class OccurrenceHistoriesModule {}
