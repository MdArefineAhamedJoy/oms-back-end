import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { createClaimSchema, updateClaimSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createClaimSchema))
  async create(@Body() dto: any) {
    const claim = await this.claimsService.create(dto);
    return { success: true, statusCode: HttpStatus.CREATED, data: claim };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    const result = await this.claimsService.findAll(page, limit);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const claim = await this.claimsService.findOne(id);
    return { success: true, statusCode: HttpStatus.OK, data: claim };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateClaimSchema))
  async update(@Param('id') id: string, @Body() dto: any) {
    const claim = await this.claimsService.update(id, dto);
    return { success: true, statusCode: HttpStatus.OK, data: claim };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.claimsService.remove(id);
  }
}
