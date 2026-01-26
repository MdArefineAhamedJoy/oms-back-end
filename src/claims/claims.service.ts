import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Claim, ClaimDocument } from './schemas/claim.schema';

@Injectable()
export class ClaimsService {
  constructor(@InjectModel(Claim.name) private claimModel: Model<ClaimDocument>) {}

  async create(dto: any): Promise<Claim> {
    const claim = new this.claimModel(dto);
    return claim.save();
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.claimModel.find().populate('user').populate('actionBy').sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.claimModel.countDocuments(),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Claim> {
    const claim = await this.claimModel.findById(id).populate('user').populate('actionBy').exec();
    if (!claim) throw new NotFoundException(`Claim with ID ${id} not found`);
    return claim;
  }

  async update(id: string, dto: any): Promise<Claim> {
    const claim = await this.claimModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!claim) throw new NotFoundException(`Claim with ID ${id} not found`);
    return claim;
  }

  async remove(id: string): Promise<void> {
    const result = await this.claimModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException(`Claim with ID ${id} not found`);
  }

  async findByUser(userId: string): Promise<Claim[]> {
    return this.claimModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }
}
