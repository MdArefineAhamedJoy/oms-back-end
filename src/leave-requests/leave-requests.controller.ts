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
import { LeaveRequestsService } from './leave-requests.service';
import { createLeaveRequestSchema, updateLeaveRequestSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('leave-requests')
export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createLeaveRequestSchema))
  async create(@Body() createLeaveRequestDto: any) {
    try {
      const leaveRequest = await this.leaveRequestsService.create(createLeaveRequestDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: leaveRequest,
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
    const result = await this.leaveRequestsService.findAll(page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async findByUser(@Param('userId') userId: string) {
    const data = await this.leaveRequestsService.findByUser(userId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('status/:status')
  @HttpCode(HttpStatus.OK)
  async findByStatus(@Param('status') status: string) {
    const data = await this.leaveRequestsService.findByStatus(status);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('type/:leaveType')
  @HttpCode(HttpStatus.OK)
  async findByLeaveType(@Param('leaveType') leaveType: string) {
    const data = await this.leaveRequestsService.findByLeaveType(leaveType);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('range')
  @HttpCode(HttpStatus.OK)
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const data = await this.leaveRequestsService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('pending/all')
  @HttpCode(HttpStatus.OK)
  async findPendingRequests() {
    const data = await this.leaveRequestsService.findPendingRequests();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('upcoming')
  @HttpCode(HttpStatus.OK)
  async findUpcomingLeave(
    @Query('userId') userId?: string,
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days?: number,
  ) {
    const data = await this.leaveRequestsService.findUpcomingLeave(userId, days);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  async getLeaveStatistics(@Query('userId') userId?: string) {
    const data = await this.leaveRequestsService.getLeaveStatistics(userId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  async approve(@Param('id') id: string, @Body() body: { approverId: string }) {
    const leaveRequest = await this.leaveRequestsService.approve(id, body.approverId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: leaveRequest,
    };
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  async reject(@Param('id') id: string, @Body() body: { approverId: string; rejectionReason: string }) {
    const leaveRequest = await this.leaveRequestsService.reject(id, body.approverId, body.rejectionReason);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: leaveRequest,
    };
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string) {
    const leaveRequest = await this.leaveRequestsService.cancel(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: leaveRequest,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const leaveRequest = await this.leaveRequestsService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: leaveRequest,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateLeaveRequestSchema))
  async update(@Param('id') id: string, @Body() updateLeaveRequestDto: any) {
    try {
      const leaveRequest = await this.leaveRequestsService.update(id, updateLeaveRequestDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: leaveRequest,
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
    await this.leaveRequestsService.remove(id);
  }
}
