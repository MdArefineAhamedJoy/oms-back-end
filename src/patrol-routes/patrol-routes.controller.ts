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
import { PatrolRoutesService } from './patrol-routes.service';
import { createPatrolRouteSchema, updatePatrolRouteSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('patrol-routes')
export class PatrolRoutesController {
  constructor(private readonly patrolRoutesService: PatrolRoutesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createPatrolRouteSchema))
  async create(@Body() createPatrolRouteDto: any) {
    try {
      const patrolRoute = await this.patrolRoutesService.create(createPatrolRouteDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: patrolRoute,
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
    const result = await this.patrolRoutesService.findAll(page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('active')
  @HttpCode(HttpStatus.OK)
  async findActive() {
    const data = await this.patrolRoutesService.findActive();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('site/:siteId')
  @HttpCode(HttpStatus.OK)
  async findBySite(@Param('siteId') siteId: string) {
    const data = await this.patrolRoutesService.findBySite(siteId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const patrolRoute = await this.patrolRoutesService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: patrolRoute,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updatePatrolRouteSchema))
  async update(@Param('id') id: string, @Body() updatePatrolRouteDto: any) {
    try {
      const patrolRoute = await this.patrolRoutesService.update(id, updatePatrolRouteDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: patrolRoute,
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
    await this.patrolRoutesService.remove(id);
  }
}
