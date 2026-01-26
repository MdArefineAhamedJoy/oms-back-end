import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { OccurrenceHistoriesService } from './occurrence-histories.service';
import { createOccurrenceHistorySchema, updateOccurrenceHistorySchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('occurrence-histories')
export class OccurrenceHistoriesController {
  constructor(private readonly occurrenceHistoriesService: OccurrenceHistoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createOccurrenceHistorySchema))
  async create(@Body() dto: any) {
    const occurrenceHistory = await this.occurrenceHistoriesService.create(dto);
    return { success: true, statusCode: HttpStatus.CREATED, data: occurrenceHistory };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('tenant') tenant?: string,
    @Query('entryNumber') entryNumber?: string,
    @Query('originalDocumentId') originalDocumentId?: string,
  ) {
    const filters: any = {};
    if (tenant) filters.tenant = tenant;
    if (entryNumber) filters.entryNumber = entryNumber;
    if (originalDocumentId) filters.originalDocumentId = originalDocumentId;

    const result = await this.occurrenceHistoriesService.findAll(page, limit, filters);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get('original/:originalDocumentId')
  @HttpCode(HttpStatus.OK)
  async findByOriginalDocument(@Param('originalDocumentId') originalDocumentId: string) {
    const data = await this.occurrenceHistoriesService.findByOriginalDocument(originalDocumentId);
    return { success: true, statusCode: HttpStatus.OK, data };
  }

  @Get('entry/:entryNumber')
  @HttpCode(HttpStatus.OK)
  async findByEntryNumber(@Param('entryNumber') entryNumber: string) {
    const data = await this.occurrenceHistoriesService.findByEntryNumber(entryNumber);
    return { success: true, statusCode: HttpStatus.OK, data };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const occurrenceHistory = await this.occurrenceHistoriesService.findOne(id);
    return { success: true, statusCode: HttpStatus.OK, data: occurrenceHistory };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateOccurrenceHistorySchema))
  async update(@Param('id') id: string, @Body() dto: any) {
    const occurrenceHistory = await this.occurrenceHistoriesService.update(id, dto);
    return { success: true, statusCode: HttpStatus.OK, data: occurrenceHistory };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.occurrenceHistoriesService.remove(id);
  }
}
