import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { createAnnouncementSchema, updateAnnouncementSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createAnnouncementSchema))
  async create(@Body() createAnnouncementDto: any) {
    const announcement = await this.announcementsService.create(createAnnouncementDto);
    return { success: true, statusCode: HttpStatus.CREATED, data: announcement };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    const result = await this.announcementsService.findAll(page, limit);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const announcement = await this.announcementsService.findOne(id);
    return { success: true, statusCode: HttpStatus.OK, data: announcement };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateAnnouncementSchema))
  async update(@Param('id') id: string, @Body() updateAnnouncementDto: any) {
    const announcement = await this.announcementsService.update(id, updateAnnouncementDto);
    return { success: true, statusCode: HttpStatus.OK, data: announcement };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.announcementsService.remove(id);
  }
}
