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
import { IncidentTypesService } from './incident-types.service';
import { createIncidentTypeSchema, updateIncidentTypeSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('incident-types')
export class IncidentTypesController {
  constructor(private readonly incidentTypesService: IncidentTypesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createIncidentTypeSchema))
  async create(@Body() createIncidentTypeDto: any) {
    try {
      const incidentType = await this.incidentTypesService.create(createIncidentTypeDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: incidentType,
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
    const result = await this.incidentTypesService.findAll(page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const incidentType = await this.incidentTypesService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: incidentType,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateIncidentTypeSchema))
  async update(@Param('id') id: string, @Body() updateIncidentTypeDto: any) {
    try {
      const incidentType = await this.incidentTypesService.update(id, updateIncidentTypeDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: incidentType,
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
    await this.incidentTypesService.remove(id);
  }
}
