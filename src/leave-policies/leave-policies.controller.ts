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
import { LeavePoliciesService } from './leave-policies.service';
import { createLeavePolicySchema, updateLeavePolicySchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('leave-policies')
export class LeavePoliciesController {
  constructor(private readonly leavePoliciesService: LeavePoliciesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createLeavePolicySchema))
  async create(@Body() createLeavePolicyDto: any) {
    try {
      const leavePolicy = await this.leavePoliciesService.create(createLeavePolicyDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: leavePolicy,
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
    const result = await this.leavePoliciesService.findAll(page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const leavePolicy = await this.leavePoliciesService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: leavePolicy,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateLeavePolicySchema))
  async update(@Param('id') id: string, @Body() updateLeavePolicyDto: any) {
    try {
      const leavePolicy = await this.leavePoliciesService.update(id, updateLeavePolicyDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: leavePolicy,
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
    await this.leavePoliciesService.remove(id);
  }
}
