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
import { IncidentsService } from './incidents.service';
import { createIncidentSchema, updateIncidentSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createIncidentSchema))
  async create(@Body() createIncidentDto: any) {
    try {
      const incident = await this.incidentsService.create(createIncidentDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: incident,
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
    const result = await this.incidentsService.findAll(page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('site/:siteId')
  @HttpCode(HttpStatus.OK)
  async findBySite(
    @Param('siteId') siteId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const data = await this.incidentsService.findBySite(
      siteId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('status/:status')
  @HttpCode(HttpStatus.OK)
  async findByStatus(@Param('status') status: string) {
    const data = await this.incidentsService.findByStatus(status);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('severity/:severity')
  @HttpCode(HttpStatus.OK)
  async findBySeverity(@Param('severity') severity: string) {
    const data = await this.incidentsService.findBySeverity(severity);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('tenant/:tenantId')
  @HttpCode(HttpStatus.OK)
  async findByTenant(
    @Param('tenantId') tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.incidentsService.findByTenant(tenantId, page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('reporter/:reporterId')
  @HttpCode(HttpStatus.OK)
  async findByReporter(@Param('reporterId') reporterId: string) {
    const data = await this.incidentsService.findByReporter(reporterId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('assignee/:assigneeId')
  @HttpCode(HttpStatus.OK)
  async findByAssignee(@Param('assigneeId') assigneeId: string) {
    const data = await this.incidentsService.findByAssignee(assigneeId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('number/:incidentNumber')
  @HttpCode(HttpStatus.OK)
  async findByIncidentNumber(@Param('incidentNumber') incidentNumber: string) {
    const incident = await this.incidentsService.findByIncidentNumber(incidentNumber);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: incident,
    };
  }

  @Get('client/:tenantId')
  @HttpCode(HttpStatus.OK)
  async getClientVisibleIncidents(@Param('tenantId') tenantId: string) {
    const data = await this.incidentsService.getClientVisibleIncidents(tenantId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  async getIncidentStatistics(@Query('siteId') siteId?: string) {
    const data = await this.incidentsService.getIncidentStatistics(siteId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post(':id/assign')
  @HttpCode(HttpStatus.OK)
  async assignTo(@Param('id') id: string, @Body() body: { assigneeId: string }) {
    const incident = await this.incidentsService.assignTo(id, body.assigneeId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: incident,
    };
  }

  @Post(':id/resolve')
  @HttpCode(HttpStatus.OK)
  async resolveIncident(@Param('id') id: string, @Body() body: { resolvedAt?: string; resolutionNotes?: string }) {
    const incident = await this.incidentsService.resolveIncident(id, {
      resolvedAt: body.resolvedAt ? new Date(body.resolvedAt) : undefined,
      resolutionNotes: body.resolutionNotes,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: incident,
    };
  }

  @Post(':id/close')
  @HttpCode(HttpStatus.OK)
  async closeIncident(@Param('id') id: string) {
    const incident = await this.incidentsService.closeIncident(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: incident,
    };
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    const incident = await this.incidentsService.updateStatus(id, body.status);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: incident,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const incident = await this.incidentsService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: incident,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateIncidentSchema))
  async update(@Param('id') id: string, @Body() updateIncidentDto: any) {
    try {
      const incident = await this.incidentsService.update(id, updateIncidentDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: incident,
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
    await this.incidentsService.remove(id);
  }
}
