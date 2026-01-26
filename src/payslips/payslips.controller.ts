import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { PaySlipsService } from './payslips.service';
import { createPaySlipSchema, updatePaySlipSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('payslips')
export class PaySlipsController {
  constructor(private readonly payslipsService: PaySlipsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createPaySlipSchema))
  async create(@Body() dto: any) {
    const payslip = await this.payslipsService.create(dto);
    return { success: true, statusCode: HttpStatus.CREATED, data: payslip };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('user') user?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const filters: any = {};
    if (user) filters.user = user;
    if (year) filters.year = parseInt(year);
    if (month) filters.month = month;

    const result = await this.payslipsService.findAll(page, limit, filters);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async findByUser(
    @Param('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.payslipsService.findByUser(userId, page, limit);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get('month/:month/year/:year')
  @HttpCode(HttpStatus.OK)
  async findByMonthAndYear(@Param('month') month: string, @Param('year') year: string) {
    const data = await this.payslipsService.findByMonthAndYear(month, parseInt(year));
    return { success: true, statusCode: HttpStatus.OK, data };
  }

  @Get('user/:userId/month/:month/year/:year')
  @HttpCode(HttpStatus.OK)
  async findByUserAndMonth(@Param('userId') userId: string, @Param('month') month: string, @Param('year') year: string) {
    const data = await this.payslipsService.findByUserAndMonth(userId, month, parseInt(year));
    return { success: true, statusCode: HttpStatus.OK, data };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const payslip = await this.payslipsService.findOne(id);
    return { success: true, statusCode: HttpStatus.OK, data: payslip };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updatePaySlipSchema))
  async update(@Param('id') id: string, @Body() dto: any) {
    const payslip = await this.payslipsService.update(id, dto);
    return { success: true, statusCode: HttpStatus.OK, data: payslip };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.payslipsService.remove(id);
  }
}
