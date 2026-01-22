import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

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
export class SettingsService {
  constructor(
    @InjectModel(Setting.name)
    private settingModel: Model<SettingDocument>,
  ) {}

  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    const setting = new this.settingModel(createSettingDto);
    return setting.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Setting>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.settingModel.find().skip(skip).limit(limit).exec(),
      this.settingModel.countDocuments(),
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

  async findOne(id: string): Promise<Setting> {
    const setting = await this.settingModel.findById(id).exec();
    if (!setting) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }
    return setting;
  }

  async update(id: string, updateSettingDto: UpdateSettingDto): Promise<Setting> {
    const existingSetting = await this.settingModel
      .findByIdAndUpdate(id, updateSettingDto, { new: true })
      .exec();
    if (!existingSetting) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }
    return existingSetting;
  }

  async remove(id: string): Promise<void> {
    const result = await this.settingModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }
  }
}
