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
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { createClientSchema, updateClientSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createClientSchema))
  async create(@Body() createClientDto: any) {
    try {
      const client = await this.clientsService.create(createClientDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: client,
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
  async findAll() {
    const clients = await this.clientsService.findAll();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: clients,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const client = await this.clientsService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: client,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateClientSchema))
  async update(@Param('id') id: string, @Body() updateClientDto: any) {
    try {
      const client = await this.clientsService.update(id, updateClientDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: client,
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
    await this.clientsService.remove(id);
  }
}
