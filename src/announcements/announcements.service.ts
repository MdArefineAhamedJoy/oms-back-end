import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Announcement, AnnouncementDocument } from './schemas/announcement.schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

interface PaginationResult<T> {
  data: T[];
  pagination: { page: number; pageSize: number; limit: number; total: number; totalPages: number; };
}

@Injectable()
export class AnnouncementsService {
  constructor(@InjectModel(Announcement.name) private announcementModel: Model<AnnouncementDocument>) {}

  async create(createAnnouncementDto: CreateAnnouncementDto): Promise<Announcement> {
    const announcement = new this.announcementModel(createAnnouncementDto);
    return announcement.save();
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Announcement>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.announcementModel.find().populate('userProfile').populate('tenant').sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.announcementModel.countDocuments(),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Announcement> {
    const announcement = await this.announcementModel.findById(id).populate('userProfile').populate('tenant').exec();
    if (!announcement) throw new NotFoundException(`Announcement with ID ${id} not found`);
    return announcement;
  }

  async update(id: string, updateAnnouncementDto: UpdateAnnouncementDto): Promise<Announcement> {
    const announcement = await this.announcementModel.findByIdAndUpdate(id, updateAnnouncementDto, { new: true }).exec();
    if (!announcement) throw new NotFoundException(`Announcement with ID ${id} not found`);
    return announcement;
  }

  async remove(id: string): Promise<void> {
    const result = await this.announcementModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException(`Announcement with ID ${id} not found`);
  }
}
