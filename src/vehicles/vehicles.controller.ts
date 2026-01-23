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
import { VehiclesService } from './vehicles.service';
import { createVehicleSchema, updateVehicleSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createVehicleSchema))
  async create(@Body() createVehicleDto: any) {
    try {
      const vehicle = await this.vehiclesService.create(createVehicleDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: vehicle,
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
    const result = await this.vehiclesService.findAll(page, limit);
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
    const data = await this.vehiclesService.findBySite(
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
    const data = await this.vehiclesService.findByStatus(status);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('registration/:registrationNumber')
  @HttpCode(HttpStatus.OK)
  async findByRegistrationNumber(@Param('registrationNumber') registrationNumber: string) {
    const vehicle = await this.vehiclesService.findByRegistrationNumber(registrationNumber);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: vehicle,
    };
  }

  @Get('site/:siteId/parked')
  @HttpCode(HttpStatus.OK)
  async findCurrentlyParked(@Param('siteId') siteId: string) {
    const data = await this.vehiclesService.findCurrentlyParked(siteId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('overdue/all')
  @HttpCode(HttpStatus.OK)
  async findOverdueVehicles() {
    const data = await this.vehiclesService.findOverdueVehicles();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('owner/:ownerName')
  @HttpCode(HttpStatus.OK)
  async findByOwner(@Param('ownerName') ownerName: string) {
    const data = await this.vehiclesService.findByOwner(ownerName);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('site/:siteId/spot/:parkingSpot')
  @HttpCode(HttpStatus.OK)
  async findByParkingSpot(@Param('siteId') siteId: string, @Param('parkingSpot') parkingSpot: string) {
    const vehicle = await this.vehiclesService.findByParkingSpot(siteId, parkingSpot);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: vehicle,
    };
  }

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  async getVehicleStatistics(@Query('siteId') siteId?: string) {
    const data = await this.vehiclesService.getVehicleStatistics(siteId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post(':id/check-in')
  @HttpCode(HttpStatus.OK)
  async checkIn(@Param('id') id: string, @Body() body: { checkedInBy?: string; parkingSpot?: string }) {
    const vehicle = await this.vehiclesService.checkIn(id, {
      checkInTime: new Date(),
      ...body,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: vehicle,
    };
  }

  @Post(':id/check-out')
  @HttpCode(HttpStatus.OK)
  async checkOut(@Param('id') id: string, @Body() body: { notes?: string }) {
    const vehicle = await this.vehiclesService.checkOut(id, {
      checkOutTime: new Date(),
      ...body,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: vehicle,
    };
  }

  @Post(':id/overdue')
  @HttpCode(HttpStatus.OK)
  async markAsOverdue(@Param('id') id: string) {
    const vehicle = await this.vehiclesService.markAsOverdue(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: vehicle,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const vehicle = await this.vehiclesService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: vehicle,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateVehicleSchema))
  async update(@Param('id') id: string, @Body() updateVehicleDto: any) {
    try {
      const vehicle = await this.vehiclesService.update(id, updateVehicleDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: vehicle,
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
    await this.vehiclesService.remove(id);
  }
}
