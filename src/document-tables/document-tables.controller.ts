import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { DocumentTablesService } from './document-tables.service';
import { createDocumentTableSchema, updateDocumentTableSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('document-tables')
export class DocumentTablesController {
  constructor(private readonly documentTablesService: DocumentTablesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createDocumentTableSchema))
  async create(@Body() dto: any) {
    const doc = await this.documentTablesService.create(dto);
    return { success: true, statusCode: HttpStatus.CREATED, data: doc };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    const result = await this.documentTablesService.findAll(page, limit);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async findByUser(@Param('userId') userId: string) {
    const data = await this.documentTablesService.findByUser(userId);
    return { success: true, statusCode: HttpStatus.OK, data };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const doc = await this.documentTablesService.findOne(id);
    return { success: true, statusCode: HttpStatus.OK, data: doc };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateDocumentTableSchema))
  async update(@Param('id') id: string, @Body() dto: any) {
    const doc = await this.documentTablesService.update(id, dto);
    return { success: true, statusCode: HttpStatus.OK, data: doc };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.documentTablesService.remove(id);
  }
}
