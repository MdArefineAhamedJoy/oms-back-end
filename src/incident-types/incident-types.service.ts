import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IncidentType, IncidentTypeDocument } from './schemas/incident-type.schema';
import { CreateIncidentTypeDto } from './dto/create-incident-type.dto';
import { UpdateIncidentTypeDto } from './dto/update-incident-type.dto';

interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class IncidentTypesService {
  constructor(
    @InjectModel(IncidentType.name)
    private incidentTypeModel: Model<IncidentTypeDocument>,
  ) {}

  async create(createIncidentTypeDto: CreateIncidentTypeDto): Promise<IncidentType> {
    const incidentType = new this.incidentTypeModel(createIncidentTypeDto);
    return incidentType.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<IncidentType>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.incidentTypeModel.find().skip(skip).limit(limit).exec(),
      this.incidentTypeModel.countDocuments(),
    ]);

    return {
      data,
      pagination: {
        page,
        pageSize: limit,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<IncidentType> {
    const incidentType = await this.incidentTypeModel.findById(id).exec();
    if (!incidentType) {
      throw new NotFoundException(`IncidentType with ID ${id} not found`);
    }
    return incidentType;
  }

  async update(id: string, updateIncidentTypeDto: UpdateIncidentTypeDto): Promise<IncidentType> {
    const existingIncidentType = await this.incidentTypeModel
      .findByIdAndUpdate(id, updateIncidentTypeDto, { new: true })
      .exec();
    if (!existingIncidentType) {
      throw new NotFoundException(`IncidentType with ID ${id} not found`);
    }
    return existingIncidentType;
  }

  async remove(id: string): Promise<void> {
    const result = await this.incidentTypeModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`IncidentType with ID ${id} not found`);
    }
  }
}
