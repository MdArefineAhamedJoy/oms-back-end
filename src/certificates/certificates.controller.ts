import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { createCertificateSchema, updateCertificateSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createCertificateSchema))
  async create(@Body() dto: any) {
    const certificate = await this.certificatesService.create(dto);
    return { success: true, statusCode: HttpStatus.CREATED, data: certificate };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    const result = await this.certificatesService.findAll(page, limit);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get('user/:userProfileId')
  @HttpCode(HttpStatus.OK)
  async findByUser(@Param('userProfileId') userProfileId: string) {
    const data = await this.certificatesService.findByUser(userProfileId);
    return { success: true, statusCode: HttpStatus.OK, data };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const certificate = await this.certificatesService.findOne(id);
    return { success: true, statusCode: HttpStatus.OK, data: certificate };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateCertificateSchema))
  async update(@Param('id') id: string, @Body() dto: any) {
    const certificate = await this.certificatesService.update(id, dto);
    return { success: true, statusCode: HttpStatus.OK, data: certificate };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.certificatesService.remove(id);
  }
}
