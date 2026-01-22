import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { TenantSeed } from './tenant.seed';

@Controller('seeds')
export class SeedsController {
  constructor(private readonly tenantSeed: TenantSeed) {}

  @Post('tenants')
  @HttpCode(HttpStatus.CREATED)
  async seedTenants() {
    await this.tenantSeed.seed();
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Tenants seeded successfully',
    };
  }
}
