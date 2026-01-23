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
import { PatrolScansService } from './patrol-scans.service';
import { createPatrolScanSchema, updatePatrolScanSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('patrol-scans')
export class PatrolScansController {
  constructor(private readonly patrolScansService: PatrolScansService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createPatrolScanSchema))
  async create(@Body() createPatrolScanDto: any) {
    try {
      const patrolScan = await this.patrolScansService.create(createPatrolScanDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: patrolScan,
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
    const result = await this.patrolScansService.findAll(page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('patrol/:patrolId')
  @HttpCode(HttpStatus.OK)
  async findByPatrol(@Param('patrolId') patrolId: string) {
    const data = await this.patrolScansService.findByPatrol(patrolId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('patrol/:patrolId/statistics')
  @HttpCode(HttpStatus.OK)
  async getPatrolScanStatistics(@Param('patrolId') patrolId: string) {
    const data = await this.patrolScansService.getPatrolScanStatistics(patrolId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('checkpoint/:checkpointId')
  @HttpCode(HttpStatus.OK)
  async findByCheckpoint(
    @Param('checkpointId') checkpointId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const data = await this.patrolScansService.findByCheckpoint(
      checkpointId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('patrol/:patrolId/missed')
  @HttpCode(HttpStatus.OK)
  async findMissedScans(@Param('patrolId') patrolId: string) {
    const data = await this.patrolScansService.findMissedScans(patrolId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('patrol/:patrolId/completed')
  @HttpCode(HttpStatus.OK)
  async findCompletedScans(@Param('patrolId') patrolId: string) {
    const data = await this.patrolScansService.findCompletedScans(patrolId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post(':id/missed')
  @HttpCode(HttpStatus.OK)
  async markAsMissed(@Param('id') id: string) {
    const patrolScan = await this.patrolScansService.markAsMissed(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: patrolScan,
    };
  }

  @Post(':id/completed')
  @HttpCode(HttpStatus.OK)
  async markAsCompleted(@Param('id') id: string) {
    const patrolScan = await this.patrolScansService.markAsCompleted(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: patrolScan,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const patrolScan = await this.patrolScansService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: patrolScan,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updatePatrolScanSchema))
  async update(@Param('id') id: string, @Body() updatePatrolScanDto: any) {
    try {
      const patrolScan = await this.patrolScansService.update(id, updatePatrolScanDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: patrolScan,
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
    await this.patrolScansService.remove(id);
  }
}
