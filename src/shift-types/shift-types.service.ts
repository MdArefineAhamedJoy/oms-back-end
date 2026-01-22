import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShiftType, ShiftTypeDocument } from './schemas/shift-type.schema';
import { CreateShiftTypeDto } from './dto/create-shift-type.dto';
import { UpdateShiftTypeDto } from './dto/update-shift-type.dto';

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
export class ShiftTypesService {
  constructor(
    @InjectModel(ShiftType.name)
    private shiftTypeModel: Model<ShiftTypeDocument>,
  ) {}

  async create(createShiftTypeDto: CreateShiftTypeDto): Promise<ShiftType> {
    const shiftType = new this.shiftTypeModel(createShiftTypeDto);
    return shiftType.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<ShiftType>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.shiftTypeModel.find().skip(skip).limit(limit).exec(),
      this.shiftTypeModel.countDocuments(),
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

  async findOne(id: string): Promise<ShiftType> {
    const shiftType = await this.shiftTypeModel.findById(id).exec();
    if (!shiftType) {
      throw new NotFoundException(`ShiftType with ID ${id} not found`);
    }
    return shiftType;
  }

  async update(id: string, updateShiftTypeDto: UpdateShiftTypeDto): Promise<ShiftType> {
    const existingShiftType = await this.shiftTypeModel
      .findByIdAndUpdate(id, updateShiftTypeDto, { new: true })
      .exec();
    if (!existingShiftType) {
      throw new NotFoundException(`ShiftType with ID ${id} not found`);
    }
    return existingShiftType;
  }

  async remove(id: string): Promise<void> {
    const result = await this.shiftTypeModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`ShiftType with ID ${id} not found`);
    }
  }
}
