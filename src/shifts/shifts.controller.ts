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
import { ShiftsService } from './shifts.service';
import { createShiftSchema, updateShiftSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createShiftSchema))
  async create(@Body() createShiftDto: any) {
    try {
      const shift = await this.shiftsService.create(createShiftDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: shift,
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
    const result = await this.shiftsService.findAll(page, limit);
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
    const data = await this.shiftsService.findByUser(
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
    const data = await this.shiftsService.findBySite(
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
    const data = await this.shiftsService.findByStatus(status);
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
    const result = await this.shiftsService.findByTenant(tenantId, page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('ongoing/active')
  @HttpCode(HttpStatus.OK)
  async findOngoingShifts() {
    const data = await this.shiftsService.findOngoingShifts();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post(':id/check-in')
  @HttpCode(HttpStatus.OK)
  async checkIn(@Param('id') id: string, @Body() checkInData: any) {
    const shift = await this.shiftsService.checkIn(id, {
      checkInTime: new Date(),
      ...checkInData,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: shift,
    };
  }

  @Post(':id/check-out')
  @HttpCode(HttpStatus.OK)
  async checkOut(@Param('id') id: string, @Body() checkOutData: any) {
    const shift = await this.shiftsService.checkOut(id, {
      checkOutTime: new Date(),
      ...checkOutData,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: shift,
    };
  }

  @Post(':id/break/start')
  @HttpCode(HttpStatus.OK)
  async startBreak(@Param('id') id: string) {
    const shift = await this.shiftsService.startBreak(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: shift,
    };
  }

  @Post(':id/break/end')
  @HttpCode(HttpStatus.OK)
  async endBreak(@Param('id') id: string) {
    const shift = await this.shiftsService.endBreak(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: shift,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const shift = await this.shiftsService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: shift,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateShiftSchema))
  async update(@Param('id') id: string, @Body() updateShiftDto: any) {
    try {
      const shift = await this.shiftsService.update(id, updateShiftDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: shift,
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
    await this.shiftsService.remove(id);
  }
}
