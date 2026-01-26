import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaySlipsService } from './payslips.service';
import { PaySlipsController } from './payslips.controller';
import { PaySlip, PaySlipSchema } from './schemas/payslip.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: PaySlip.name, schema: PaySlipSchema }])],
  controllers: [PaySlipsController],
  providers: [PaySlipsService],
  exports: [PaySlipsService],
})
export class PaySlipsModule {}
