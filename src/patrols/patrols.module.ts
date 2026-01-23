import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatrolsService } from './patrols.service';
import { PatrolsController } from './patrols.controller';
import { Patrol, PatrolSchema } from './schemas/patrol.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patrol.name, schema: PatrolSchema },
    ]),
  ],
  providers: [PatrolsService],
  controllers: [PatrolsController],
})
export class PatrolsModule {}
