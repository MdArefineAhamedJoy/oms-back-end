import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IncidentSetting, IncidentSettingDocument } from './schemas/incident-setting.schema';

@Injectable()
export class IncidentSettingsService {
  constructor(@InjectModel(IncidentSetting.name) private incidentSettingModel: Model<IncidentSettingDocument>) {}

  async create(dto: any): Promise<IncidentSetting> {
    const setting = new this.incidentSettingModel(dto);
    return setting.save();
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.incidentSettingModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.incidentSettingModel.countDocuments(),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<IncidentSetting> {
    const setting = await this.incidentSettingModel.findById(id).exec();
    if (!setting) throw new NotFoundException(`IncidentSetting with ID ${id} not found`);
    return setting;
  }

  async getSettings(): Promise<IncidentSetting | null> {
    return this.incidentSettingModel.findOne().exec();
  }

  async update(id: string, dto: any): Promise<IncidentSetting> {
    const setting = await this.incidentSettingModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!setting) throw new NotFoundException(`IncidentSetting with ID ${id} not found`);
    return setting;
  }

  async remove(id: string): Promise<void> {
    const result = await this.incidentSettingModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException(`IncidentSetting with ID ${id} not found`);
  }
}
