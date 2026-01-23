import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaveRequestsService } from './leave-requests.service';
import { LeaveRequestsController } from './leave-requests.controller';
import { LeaveRequest, LeaveRequestSchema } from './schemas/leave-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeaveRequest.name, schema: LeaveRequestSchema },
    ]),
  ],
  providers: [LeaveRequestsService],
  controllers: [LeaveRequestsController],
})
export class LeaveRequestsModule {}
