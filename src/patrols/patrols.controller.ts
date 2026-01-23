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
  ConflictException,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { PatrolsService } from './patrols.service';
import { createPatrolSchema, updatePatrolSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('patrols')
export class PatrolsController {
  constructor(private readonly patrolsService: PatrolsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createPatrolSchema))
  async create(@Body() createPatrolDto: any) {
    try {
      const patrol = await this.patrolsService.create(createPatrolDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: patrol,
      };
    } catch (error) {
      if ((error as MongoError).code === 11000) {
        const field = Object.keys((error as any).keyPattern)[0];
        throw new ConflictException(
          `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        );
      }
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.patrolsService.findAll(page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async findByUser(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const data = await this.patrolsService.findByUser(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('site/:siteId')
  @HttpCode(HttpStatus.OK)
  async findBySite(
    @Param('siteId') siteId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const data = await this.patrolsService.findBySite(
      siteId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('shift/:shiftId')
  @HttpCode(HttpStatus.OK)
  async findByShift(@Param('shiftId') shiftId: string) {
    const data = await this.patrolsService.findByShift(shiftId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('status/:status')
  @HttpCode(HttpStatus.OK)
  async findByStatus(@Param('status') status: string) {
    const data = await this.patrolsService.findByStatus(status);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('tenant/:tenantId')
  @HttpCode(HttpStatus.OK)
  async findByTenant(
    @Param('tenantId') tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.patrolsService.findByTenant(tenantId, page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('in-progress/active')
  @HttpCode(HttpStatus.OK)
  async findInProgress() {
    const data = await this.patrolsService.findInProgress();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  async startPatrol(@Param('id') id: string) {
    const patrol = await this.patrolsService.startPatrol(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: patrol,
    };
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  async completePatrol(@Param('id') id: string, @Body() body: { endTime?: string; notes?: string }) {
    const patrol = await this.patrolsService.completePatrol(
      id,
      body.endTime ? new Date(body.endTime) : undefined,
      body.notes,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: patrol,
    };
  }

  @Post(':id/abandon')
  @HttpCode(HttpStatus.OK)
  async abandonPatrol(@Param('id') id: string, @Body() body: { notes?: string }) {
    const patrol = await this.patrolsService.abandonPatrol(id, body.notes);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: patrol,
    };
  }

  @Patch(':id/scan-counts')
  @HttpCode(HttpStatus.OK)
  async updateScanCounts(
    @Param('id') id: string,
    @Body() body: { totalScans: number; missedScans: number },
  ) {
    const patrol = await this.patrolsService.updateScanCounts(id, body.totalScans, body.missedScans);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: patrol,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const patrol = await this.patrolsService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: patrol,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updatePatrolSchema))
  async update(@Param('id') id: string, @Body() updatePatrolDto: any) {
    try {
      const patrol = await this.patrolsService.update(id, updatePatrolDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: patrol,
      };
    } catch (error) {
      if ((error as MongoError).code === 11000) {
        const field = Object.keys((error as any).keyPattern)[0];
        throw new ConflictException(
          `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        );
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.patrolsService.remove(id);
  }
}
