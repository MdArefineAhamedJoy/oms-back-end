import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { OccurrenceBooksService } from './occurrence-books.service';
import { createOccurrenceBookSchema, updateOccurrenceBookSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { EntryType, Priority, FollowUpStatus } from './schemas/occurrence-book.schema';

@Controller('occurrence-books')
export class OccurrenceBooksController {
  constructor(private readonly occurrenceBooksService: OccurrenceBooksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createOccurrenceBookSchema))
  async create(@Body() dto: any) {
    const occurrenceBook = await this.occurrenceBooksService.create(dto);
    return { success: true, statusCode: HttpStatus.CREATED, data: occurrenceBook };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('tenant') tenant?: string,
    @Query('site') site?: string,
    @Query('entryType') entryType?: EntryType,
    @Query('priority') priority?: Priority,
    @Query('acknowledgmentStatus') acknowledgmentStatus?: string,
    @Query('followUpStatus') followUpStatus?: string,
    @Query('archived') archived?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filters: any = {};
    if (tenant) filters.tenant = tenant;
    if (site) filters.site = site;
    if (entryType) filters.entryType = entryType;
    if (priority) filters.priority = priority;
    if (acknowledgmentStatus) filters.acknowledgmentStatus = acknowledgmentStatus;
    if (followUpStatus) filters.followUpStatus = followUpStatus;
    if (archived !== undefined) filters.archived = archived === 'true';
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    const result = await this.occurrenceBooksService.findAll(page, limit, filters);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get('site/:siteId')
  @HttpCode(HttpStatus.OK)
  async findBySite(
    @Param('siteId') siteId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.occurrenceBooksService.findBySite(siteId, page, limit);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get('shift/:shiftId')
  @HttpCode(HttpStatus.OK)
  async findByShift(@Param('shiftId') shiftId: string) {
    const data = await this.occurrenceBooksService.findByShift(shiftId);
    return { success: true, statusCode: HttpStatus.OK, data };
  }

  @Get('entry-type/:entryType')
  @HttpCode(HttpStatus.OK)
  async findByEntryType(@Param('entryType') entryType: EntryType) {
    const data = await this.occurrenceBooksService.findByEntryType(entryType);
    return { success: true, statusCode: HttpStatus.OK, data };
  }

  @Get('priority/:priority')
  @HttpCode(HttpStatus.OK)
  async findByPriority(@Param('priority') priority: Priority) {
    const data = await this.occurrenceBooksService.findByPriority(priority);
    return { success: true, statusCode: HttpStatus.OK, data };
  }

  @Get('pending-acknowledgments')
  @HttpCode(HttpStatus.OK)
  async findPendingAcknowledgments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.occurrenceBooksService.findPendingAcknowledgments(page, limit);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get('pending-follow-ups')
  @HttpCode(HttpStatus.OK)
  async findPendingFollowUps(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.occurrenceBooksService.findPendingFollowUps(page, limit);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get('generate-entry-number/:tenantId/:siteId')
  @HttpCode(HttpStatus.OK)
  async generateEntryNumber(@Param('tenantId') tenantId: string, @Param('siteId') siteId: string) {
    const entryNumber = await this.occurrenceBooksService.generateEntryNumber(tenantId, siteId);
    return { success: true, statusCode: HttpStatus.OK, data: { entryNumber } };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const occurrenceBook = await this.occurrenceBooksService.findOne(id);
    return { success: true, statusCode: HttpStatus.OK, data: occurrenceBook };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateOccurrenceBookSchema))
  async update(@Param('id') id: string, @Body() dto: any) {
    const occurrenceBook = await this.occurrenceBooksService.update(id, dto);
    return { success: true, statusCode: HttpStatus.OK, data: occurrenceBook };
  }

  @Patch(':id/acknowledge')
  @HttpCode(HttpStatus.OK)
  async acknowledge(@Param('id') id: string, @Body('acknowledgedBy') acknowledgedBy: string) {
    const occurrenceBook = await this.occurrenceBooksService.acknowledge(id, acknowledgedBy);
    return { success: true, statusCode: HttpStatus.OK, data: occurrenceBook };
  }

  @Patch(':id/follow-up-status')
  @HttpCode(HttpStatus.OK)
  async updateFollowUpStatus(
    @Param('id') id: string,
    @Body('status') status: FollowUpStatus,
    @Body('notes') notes?: string,
  ) {
    const occurrenceBook = await this.occurrenceBooksService.updateFollowUpStatus(id, status, notes);
    return { success: true, statusCode: HttpStatus.OK, data: occurrenceBook };
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  async archive(@Param('id') id: string, @Body('reason') reason: string, @Body('archivedBy') archivedBy: string) {
    const occurrenceBook = await this.occurrenceBooksService.archive(id, reason, archivedBy);
    return { success: true, statusCode: HttpStatus.OK, data: occurrenceBook };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.occurrenceBooksService.remove(id);
  }
}
