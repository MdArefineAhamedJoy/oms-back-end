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
import { LeaveBalancesService } from './leave-balances.service';
import { createLeaveBalanceSchema, updateLeaveBalanceSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('leave-balances')
export class LeaveBalancesController {
  constructor(private readonly leaveBalancesService: LeaveBalancesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createLeaveBalanceSchema))
  async create(@Body() createLeaveBalanceDto: any) {
    try {
      const leaveBalance = await this.leaveBalancesService.create(createLeaveBalanceDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: leaveBalance,
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
    const result = await this.leaveBalancesService.findAll(page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('user/:userProfileId')
  @HttpCode(HttpStatus.OK)
  async findByUser(@Param('userProfileId') userProfileId: string) {
    const data = await this.leaveBalancesService.findByUser(userProfileId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('user/:userProfileId/year/:year')
  @HttpCode(HttpStatus.OK)
  async findByUserAndYear(@Param('userProfileId') userProfileId: string, @Param('year') year: number) {
    const data = await this.leaveBalancesService.findByUserAndYear(userProfileId, year);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('year/:year')
  @HttpCode(HttpStatus.OK)
  async findByYear(@Param('year') year: number) {
    const data = await this.leaveBalancesService.findByYear(year);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('current/:userProfileId')
  @HttpCode(HttpStatus.OK)
  async getCurrentBalance(@Param('userProfileId') userProfileId: string) {
    const data = await this.leaveBalancesService.getCurrentBalance(userProfileId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('summary/:userProfileId')
  @HttpCode(HttpStatus.OK)
  async getLeaveSummary(@Param('userProfileId') userProfileId: string) {
    const data = await this.leaveBalancesService.getLeaveSummary(userProfileId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('alerts/low-balance')
  @HttpCode(HttpStatus.OK)
  async getLowBalanceAlerts(@Query('threshold', new DefaultValuePipe(3), ParseIntPipe) threshold: number) {
    const data = await this.leaveBalancesService.getLowBalanceAlerts(threshold);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post('update-balance')
  @HttpCode(HttpStatus.OK)
  async updateBalance(@Body() body: { userProfileId: string; leaveType: string; days: number }) {
    const data = await this.leaveBalancesService.updateBalance(
      body.userProfileId,
      body.leaveType,
      body.days,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post('carry-forward')
  @HttpCode(HttpStatus.OK)
  async addCarriedForward(@Body() body: { userProfileId: string; year: number; days: number }) {
    const data = await this.leaveBalancesService.addCarriedForward(
      body.userProfileId,
      body.year,
      body.days,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post('carry-forward/:userProfileId')
  @HttpCode(HttpStatus.OK)
  async carryForwardFromPreviousYear(@Param('userProfileId') userProfileId: string) {
    const data = await this.leaveBalancesService.carryForwardFromPreviousYear(userProfileId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post('reset/:year')
  @HttpCode(HttpStatus.OK)
  async resetAnnualBalancesForYear(@Param('year') year: number) {
    const count = await this.leaveBalancesService.resetAnnualBalancesForYear(year);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: { resetCount: count },
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const leaveBalance = await this.leaveBalancesService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: leaveBalance,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateLeaveBalanceSchema))
  async update(@Param('id') id: string, @Body() updateLeaveBalanceDto: any) {
    try {
      const leaveBalance = await this.leaveBalancesService.update(id, updateLeaveBalanceDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: leaveBalance,
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
    await this.leaveBalancesService.remove(id);
  }
}
