import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClaimsService } from './claims.service';
import { ClaimsController } from './claims.controller';
import { Claim, ClaimSchema } from './schemas/claim.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Claim.name, schema: ClaimSchema }])],
  providers: [ClaimsService],
  controllers: [ClaimsController],
})
export class ClaimsModule {}
