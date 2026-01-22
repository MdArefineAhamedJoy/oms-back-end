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
import { ShiftTypesService } from './shift-types.service';
import { createShiftTypeSchema, updateShiftTypeSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('shift-types')
export class ShiftTypesController {
  constructor(private readonly shiftTypesService: ShiftTypesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createShiftTypeSchema))
  async create(@Body() createShiftTypeDto: any) {
    try {
      const shiftType = await this.shiftTypesService.create(createShiftTypeDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: shiftType,
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
    const result = await this.shiftTypesService.findAll(page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const shiftType = await this.shiftTypesService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: shiftType,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateShiftTypeSchema))
  async update(@Param('id') id: string, @Body() updateShiftTypeDto: any) {
    try {
      const shiftType = await this.shiftTypesService.update(id, updateShiftTypeDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: shiftType,
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
    await this.shiftTypesService.remove(id);
  }
}
