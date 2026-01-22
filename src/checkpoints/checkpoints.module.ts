import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckpointsService } from './checkpoints.service';
import { CheckpointsController } from './checkpoints.controller';
import { Checkpoint, CheckpointSchema } from './schemas/checkpoint.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Checkpoint.name, schema: CheckpointSchema },
    ]),
  ],
  providers: [CheckpointsService],
  controllers: [CheckpointsController],
})
export class CheckpointsModule {}
