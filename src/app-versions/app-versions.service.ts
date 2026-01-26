import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppVersion, AppVersionDocument } from './schemas/app-version.schema';

@Injectable()
export class AppVersionsService {
  constructor(@InjectModel(AppVersion.name) private appVersionModel: Model<AppVersionDocument>) {}

  async create(dto: any): Promise<AppVersion> {
    const appVersion = new this.appVersionModel(dto);
    return appVersion.save();
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.appVersionModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.appVersionModel.countDocuments(),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<AppVersion> {
    const appVersion = await this.appVersionModel.findById(id).exec();
    if (!appVersion) throw new NotFoundException(`AppVersion with ID ${id} not found`);
    return appVersion;
  }

  async update(id: string, dto: any): Promise<AppVersion> {
    const appVersion = await this.appVersionModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!appVersion) throw new NotFoundException(`AppVersion with ID ${id} not found`);
    return appVersion;
  }

  async remove(id: string): Promise<void> {
    const result = await this.appVersionModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException(`AppVersion with ID ${id} not found`);
  }

  async findByVersion(version: string): Promise<AppVersion | null> {
    return this.appVersionModel.findOne({ version }).exec();
  }

  async findByCommitHash(commitHash: string): Promise<AppVersion | null> {
    return this.appVersionModel.findOne({ commitHash }).exec();
  }
}
