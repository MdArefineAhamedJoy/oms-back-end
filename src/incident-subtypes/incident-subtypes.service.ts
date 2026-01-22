import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IncidentSubtype, IncidentSubtypeDocument } from './schemas/incident-subtype.schema';
import { CreateIncidentSubtypeDto } from './dto/create-incident-subtype.dto';
import { UpdateIncidentSubtypeDto } from './dto/update-incident-subtype.dto';

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
export class IncidentSubtypesService {
  constructor(
    @InjectModel(IncidentSubtype.name)
    private incidentSubtypeModel: Model<IncidentSubtypeDocument>,
  ) {}

  async create(createIncidentSubtypeDto: CreateIncidentSubtypeDto): Promise<IncidentSubtype> {
    const incidentSubtype = new this.incidentSubtypeModel(createIncidentSubtypeDto);
    return incidentSubtype.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<IncidentSubtype>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.incidentSubtypeModel
        .find()
        .populate('incidentType')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.incidentSubtypeModel.countDocuments(),
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

  async findOne(id: string): Promise<IncidentSubtype> {
    const incidentSubtype = await this.incidentSubtypeModel
      .findById(id)
      .populate('incidentType')
      .exec();
    if (!incidentSubtype) {
      throw new NotFoundException(`IncidentSubtype with ID ${id} not found`);
    }
    return incidentSubtype;
  }

  async update(id: string, updateIncidentSubtypeDto: UpdateIncidentSubtypeDto): Promise<IncidentSubtype> {
    const existingIncidentSubtype = await this.incidentSubtypeModel
      .findByIdAndUpdate(id, updateIncidentSubtypeDto, { new: true })
      .exec();
    if (!existingIncidentSubtype) {
      throw new NotFoundException(`IncidentSubtype with ID ${id} not found`);
    }
    return existingIncidentSubtype;
  }

  async remove(id: string): Promise<void> {
    const result = await this.incidentSubtypeModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`IncidentSubtype with ID ${id} not found`);
    }
  }

  async findByIncidentType(incidentTypeId: string): Promise<IncidentSubtype[]> {
    return this.incidentSubtypeModel
      .find({ incidentType: incidentTypeId, isActive: true })
      .exec();
  }
}
