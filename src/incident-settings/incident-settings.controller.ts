import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { IncidentSettingsService } from './incident-settings.service';
import { createIncidentSettingSchema, updateIncidentSettingSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('incident-settings')
export class IncidentSettingsController {
  constructor(private readonly incidentSettingsService: IncidentSettingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createIncidentSettingSchema))
  async create(@Body() dto: any) {
    const setting = await this.incidentSettingsService.create(dto);
    return { success: true, statusCode: HttpStatus.CREATED, data: setting };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    const result = await this.incidentSettingsService.findAll(page, limit);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get('settings')
  @HttpCode(HttpStatus.OK)
  async getSettings() {
    const setting = await this.incidentSettingsService.getSettings();
    return { success: true, statusCode: HttpStatus.OK, data: setting };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const setting = await this.incidentSettingsService.findOne(id);
    return { success: true, statusCode: HttpStatus.OK, data: setting };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateIncidentSettingSchema))
  async update(@Param('id') id: string, @Body() dto: any) {
    const setting = await this.incidentSettingsService.update(id, dto);
    return { success: true, statusCode: HttpStatus.OK, data: setting };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.incidentSettingsService.remove(id);
  }
}
