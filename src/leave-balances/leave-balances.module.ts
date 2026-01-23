import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaveBalancesService } from './leave-balances.service';
import { LeaveBalancesController } from './leave-balances.controller';
import { LeaveBalance, LeaveBalanceSchema } from './schemas/leave-balance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeaveBalance.name, schema: LeaveBalanceSchema },
    ]),
  ],
  providers: [LeaveBalancesService],
  controllers: [LeaveBalancesController],
})
export class LeaveBalancesModule {}
