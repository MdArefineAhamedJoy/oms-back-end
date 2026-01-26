import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AppVersionsService } from './app-versions.service';
import { createAppVersionSchema, updateAppVersionSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('app-versions')
export class AppVersionsController {
  constructor(private readonly appVersionsService: AppVersionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createAppVersionSchema))
  async create(@Body() dto: any) {
    const appVersion = await this.appVersionsService.create(dto);
    return { success: true, statusCode: HttpStatus.CREATED, data: appVersion };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    const result = await this.appVersionsService.findAll(page, limit);
    return { success: true, statusCode: HttpStatus.OK, ...result };
  }

  @Get('version/:version')
  @HttpCode(HttpStatus.OK)
  async findByVersion(@Param('version') version: string) {
    const data = await this.appVersionsService.findByVersion(version);
    return { success: true, statusCode: HttpStatus.OK, data };
  }

  @Get('commit/:commitHash')
  @HttpCode(HttpStatus.OK)
  async findByCommitHash(@Param('commitHash') commitHash: string) {
    const data = await this.appVersionsService.findByCommitHash(commitHash);
    return { success: true, statusCode: HttpStatus.OK, data };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const appVersion = await this.appVersionsService.findOne(id);
    return { success: true, statusCode: HttpStatus.OK, data: appVersion };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateAppVersionSchema))
  async update(@Param('id') id: string, @Body() dto: any) {
    const appVersion = await this.appVersionsService.update(id, dto);
    return { success: true, statusCode: HttpStatus.OK, data: appVersion };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.appVersionsService.remove(id);
  }
}
