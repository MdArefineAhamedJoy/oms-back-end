import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { GeofenceOverridesService } from './geofence-overrides.service';
import { createGeofenceOverrideSchema, updateGeofenceOverrideSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('geofence-overrides')
export class GeofenceOverridesController {
  constructor(private readonly geofenceOverridesService: GeofenceOverridesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createGeofenceOverrideSchema))
  async create(@Body() dto: any) {
    const geofenceOverride = await this.geofenceOverridesService.create(dto);
    return { success: true, statusCode: HttpStatus.CREATED, data: geofenceOverride };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    const result = await this.geofenceOverridesService.findAll(page, limit);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get('status/:status')
  @HttpCode(HttpStatus.OK)
  async findByOverrideStatus(
    @Param('status') status: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.geofenceOverridesService.findByOverrideStatus(status, page, limit);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async findByUser(@Param('userId') userId: string) {
    const data = await this.geofenceOverridesService.findByUser(userId);
    return { success: true, statusCode: HttpStatus.OK, data };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const geofenceOverride = await this.geofenceOverridesService.findOne(id);
    return { success: true, statusCode: HttpStatus.OK, data: geofenceOverride };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateGeofenceOverrideSchema))
  async update(@Param('id') id: string, @Body() dto: any) {
    const geofenceOverride = await this.geofenceOverridesService.update(id, dto);
    return { success: true, statusCode: HttpStatus.OK, data: geofenceOverride };
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  async approveOverride(@Param('id') id: string, @Body('approvedBy') approvedBy: string, @Body('notes') notes: string) {
    const geofenceOverride = await this.geofenceOverridesService.approveOverride(id, approvedBy, notes);
    return { success: true, statusCode: HttpStatus.OK, data: geofenceOverride };
  }

  @Patch(':id/reject')
  @HttpCode(HttpStatus.OK)
  async rejectOverride(@Param('id') id: string, @Body('approvedBy') approvedBy: string, @Body('notes') notes: string) {
    const geofenceOverride = await this.geofenceOverridesService.rejectOverride(id, approvedBy, notes);
    return { success: true, statusCode: HttpStatus.OK, data: geofenceOverride };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.geofenceOverridesService.remove(id);
  }
}
