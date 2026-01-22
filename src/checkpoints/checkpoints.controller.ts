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
  ParseFloatPipe,
} from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';
import { createCheckpointSchema, updateCheckpointSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('checkpoints')
export class CheckpointsController {
  constructor(private readonly checkpointsService: CheckpointsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createCheckpointSchema))
  async create(@Body() createCheckpointDto: any) {
    try {
      const checkpoint = await this.checkpointsService.create(createCheckpointDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: checkpoint,
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
    const result = await this.checkpointsService.findAll(page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('active')
  @HttpCode(HttpStatus.OK)
  async findActive() {
    const data = await this.checkpointsService.findActive();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('site/:siteId')
  @HttpCode(HttpStatus.OK)
  async findBySite(@Param('siteId') siteId: string) {
    const data = await this.checkpointsService.findBySite(siteId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('qr/:qrCode')
  @HttpCode(HttpStatus.OK)
  async findByQrCode(@Param('qrCode') qrCode: string) {
    const checkpoint = await this.checkpointsService.findByQrCode(qrCode);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: checkpoint,
    };
  }

  @Get('nearby/:lat/:lng')
  @HttpCode(HttpStatus.OK)
  async findNearby(
    @Param('lat', ParseFloatPipe) lat: number,
    @Param('lng', ParseFloatPipe) lng: number,
    @Query('maxDistance', new DefaultValuePipe(100), ParseIntPipe) maxDistance: number,
  ) {
    const data = await this.checkpointsService.findNearby(lat, lng, maxDistance);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const checkpoint = await this.checkpointsService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: checkpoint,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateCheckpointSchema))
  async update(@Param('id') id: string, @Body() updateCheckpointDto: any) {
    try {
      const checkpoint = await this.checkpointsService.update(id, updateCheckpointDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: checkpoint,
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
    await this.checkpointsService.remove(id);
  }
}
