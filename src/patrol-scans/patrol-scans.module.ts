import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatrolScansService } from './patrol-scans.service';
import { PatrolScansController } from './patrol-scans.controller';
import { PatrolScan, PatrolScanSchema } from './schemas/patrol-scan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PatrolScan.name, schema: PatrolScanSchema },
    ]),
  ],
  providers: [PatrolScansService],
  controllers: [PatrolScansController],
})
export class PatrolScansModule {}
