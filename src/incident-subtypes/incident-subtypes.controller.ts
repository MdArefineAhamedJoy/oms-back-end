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
import { IncidentSubtypesService } from './incident-subtypes.service';
import { createIncidentSubtypeSchema, updateIncidentSubtypeSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('incident-subtypes')
export class IncidentSubtypesController {
  constructor(private readonly incidentSubtypesService: IncidentSubtypesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createIncidentSubtypeSchema))
  async create(@Body() createIncidentSubtypeDto: any) {
    try {
      const incidentSubtype = await this.incidentSubtypesService.create(createIncidentSubtypeDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: incidentSubtype,
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
    const result = await this.incidentSubtypesService.findAll(page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('incident-type/:incidentTypeId')
  @HttpCode(HttpStatus.OK)
  async findByIncidentType(@Param('incidentTypeId') incidentTypeId: string) {
    const data = await this.incidentSubtypesService.findByIncidentType(incidentTypeId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const incidentSubtype = await this.incidentSubtypesService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: incidentSubtype,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateIncidentSubtypeSchema))
  async update(@Param('id') id: string, @Body() updateIncidentSubtypeDto: any) {
    try {
      const incidentSubtype = await this.incidentSubtypesService.update(id, updateIncidentSubtypeDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: incidentSubtype,
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
    await this.incidentSubtypesService.remove(id);
  }
}
