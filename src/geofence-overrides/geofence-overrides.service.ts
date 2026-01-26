import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeofenceOverride, GeofenceOverrideDocument } from './schemas/geofence-override.schema';

@Injectable()
export class GeofenceOverridesService {
  constructor(@InjectModel(GeofenceOverride.name) private geofenceOverrideModel: Model<GeofenceOverrideDocument>) {}

  async create(dto: any): Promise<GeofenceOverride> {
    const geofenceOverride = new this.geofenceOverrideModel(dto);
    return geofenceOverride.save();
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.geofenceOverrideModel.find().populate('site').populate('user').populate('tenant').sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.geofenceOverrideModel.countDocuments(),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<GeofenceOverride> {
    const geofenceOverride = await this.geofenceOverrideModel.findById(id).populate('site').populate('user').populate('tenant').exec();
    if (!geofenceOverride) throw new NotFoundException(`GeofenceOverride with ID ${id} not found`);
    return geofenceOverride;
  }

  async update(id: string, dto: any): Promise<GeofenceOverride> {
    const geofenceOverride = await this.geofenceOverrideModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!geofenceOverride) throw new NotFoundException(`GeofenceOverride with ID ${id} not found`);
    return geofenceOverride;
  }

  async remove(id: string): Promise<void> {
    const result = await this.geofenceOverrideModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException(`GeofenceOverride with ID ${id} not found`);
  }

  async findByOverrideStatus(overrideStatus: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.geofenceOverrideModel.find({ overrideStatus }).populate('site').populate('user').sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.geofenceOverrideModel.countDocuments({ overrideStatus }),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findByUser(userId: string): Promise<GeofenceOverride[]> {
    return this.geofenceOverrideModel.find({ user: userId }).populate('site').populate('tenant').sort({ createdAt: -1 }).exec();
  }

  async approveOverride(id: string, approvedBy: string, notes: string): Promise<GeofenceOverride> {
    const geofenceOverride = await this.geofenceOverrideModel
      .findByIdAndUpdate(
        id,
        {
          overrideStatus: 'APPROVED',
          approvedBy,
          approvalNotes: notes,
          approvedAt: new Date(),
        },
        { new: true },
      )
      .exec();
    if (!geofenceOverride) throw new NotFoundException(`GeofenceOverride with ID ${id} not found`);
    return geofenceOverride;
  }

  async rejectOverride(id: string, approvedBy: string, notes: string): Promise<GeofenceOverride> {
    const geofenceOverride = await this.geofenceOverrideModel
      .findByIdAndUpdate(
        id,
        {
          overrideStatus: 'REJECTED',
          approvedBy,
          approvalNotes: notes,
          approvedAt: new Date(),
        },
        { new: true },
      )
      .exec();
    if (!geofenceOverride) throw new NotFoundException(`GeofenceOverride with ID ${id} not found`);
    return geofenceOverride;
  }
}
