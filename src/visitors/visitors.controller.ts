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
import { VisitorsService } from './visitors.service';
import { createVisitorSchema, updateVisitorSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createVisitorSchema))
  async create(@Body() createVisitorDto: any) {
    try {
      const visitor = await this.visitorsService.create(createVisitorDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: visitor,
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
    const result = await this.visitorsService.findAll(page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('site/:siteId')
  @HttpCode(HttpStatus.OK)
  async findBySite(
    @Param('siteId') siteId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const data = await this.visitorsService.findBySite(
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

  @Get('status/:status')
  @HttpCode(HttpStatus.OK)
  async findByStatus(@Param('status') status: string) {
    const data = await this.visitorsService.findByStatus(status);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('type/:visitorType')
  @HttpCode(HttpStatus.OK)
  async findByVisitorType(@Param('visitorType') visitorType: string) {
    const data = await this.visitorsService.findByVisitorType(visitorType);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('site/:siteId/current')
  @HttpCode(HttpStatus.OK)
  async findCurrentlyOnSite(@Param('siteId') siteId: string) {
    const data = await this.visitorsService.findCurrentlyOnSite(siteId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('overdue/all')
  @HttpCode(HttpStatus.OK)
  async findOverdueVisitors() {
    const data = await this.visitorsService.findOverdueVisitors();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('identification/:identificationNumber')
  @HttpCode(HttpStatus.OK)
  async findByIdentificationNumber(@Param('identificationNumber') identificationNumber: string) {
    const data = await this.visitorsService.findByIdentificationNumber(identificationNumber);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('host/:host')
  @HttpCode(HttpStatus.OK)
  async findByHost(@Param('host') host: string) {
    const data = await this.visitorsService.findByHost(host);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  async getVisitorStatistics(@Query('siteId') siteId?: string) {
    const data = await this.visitorsService.getVisitorStatistics(siteId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post(':id/check-in')
  @HttpCode(HttpStatus.OK)
  async checkIn(@Param('id') id: string, @Body() body: { checkedInBy?: string; signature?: string; photo?: string }) {
    const visitor = await this.visitorsService.checkIn(id, {
      checkInTime: new Date(),
      ...body,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: visitor,
    };
  }

  @Post(':id/check-out')
  @HttpCode(HttpStatus.OK)
  async checkOut(@Param('id') id: string, @Body() body: { notes?: string }) {
    const visitor = await this.visitorsService.checkOut(id, {
      checkOutTime: new Date(),
      ...body,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: visitor,
    };
  }

  @Post(':id/overdue')
  @HttpCode(HttpStatus.OK)
  async markAsOverdue(@Param('id') id: string) {
    const visitor = await this.visitorsService.markAsOverdue(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: visitor,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const visitor = await this.visitorsService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: visitor,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateVisitorSchema))
  async update(@Param('id') id: string, @Body() updateVisitorDto: any) {
    try {
      const visitor = await this.visitorsService.update(id, updateVisitorDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: visitor,
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
    await this.visitorsService.remove(id);
  }
}
