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
import { SettingsService } from './settings.service';
import { createSettingSchema, updateSettingSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createSettingSchema))
  async create(@Body() createSettingDto: any) {
    try {
      const setting = await this.settingsService.create(createSettingDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: setting,
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
    const result = await this.settingsService.findAll(page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const setting = await this.settingsService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: setting,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateSettingSchema))
  async update(@Param('id') id: string, @Body() updateSettingDto: any) {
    try {
      const setting = await this.settingsService.update(id, updateSettingDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: setting,
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
    await this.settingsService.remove(id);
  }
}
