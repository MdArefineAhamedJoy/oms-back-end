import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedsController } from './seeds.controller';
import { TenantSeed } from './tenant.seed';
import { Tenant, TenantSchema } from '../tenants/schemas/tenant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
  ],
  controllers: [SeedsController],
  providers: [TenantSeed],
})
export class SeedsModule {}
