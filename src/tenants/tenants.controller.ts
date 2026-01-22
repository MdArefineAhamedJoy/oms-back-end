import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { createTenantSchema, updateTenantSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createTenantSchema))
  async create(@Body() createTenantDto: any) {
    const tenant = await this.tenantsService.create(createTenantDto);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      data: tenant,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const tenants = await this.tenantsService.findAll();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: tenants,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const tenant = await this.tenantsService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: tenant,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateTenantSchema))
  async update(@Param('id') id: string, @Body() updateTenantDto: any) {
    const tenant = await this.tenantsService.update(id, updateTenantDto);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: tenant,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.tenantsService.remove(id);
  }
}
