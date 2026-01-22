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
import { UserProfilesService } from './user-profiles.service';
import { createUserProfileSchema, updateUserProfileSchema } from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MongoError } from 'mongodb';

@Controller('user-profiles')
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createUserProfileSchema))
  async create(@Body() createUserProfileDto: any) {
    try {
      const userProfile = await this.userProfilesService.create(createUserProfileDto);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: userProfile,
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
    const result = await this.userProfilesService.findAll(page, limit);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const userProfile = await this.userProfilesService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: userProfile,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateUserProfileSchema))
  async update(@Param('id') id: string, @Body() updateUserProfileDto: any) {
    try {
      const userProfile = await this.userProfilesService.update(id, updateUserProfileDto);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: userProfile,
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
    await this.userProfilesService.remove(id);
  }
}
