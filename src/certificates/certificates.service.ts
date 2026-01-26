import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Certificate, CertificateDocument } from './schemas/certificate.schema';

@Injectable()
export class CertificatesService {
  constructor(@InjectModel(Certificate.name) private certificateModel: Model<CertificateDocument>) {}

  async create(dto: any): Promise<Certificate> {
    const certificate = new this.certificateModel(dto);
    return certificate.save();
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.certificateModel.find().populate('user_profile').sort({ expiryDate: -1 }).skip(skip).limit(limit).exec(),
      this.certificateModel.countDocuments(),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Certificate> {
    const certificate = await this.certificateModel.findById(id).populate('user_profile').exec();
    if (!certificate) throw new NotFoundException(`Certificate with ID ${id} not found`);
    return certificate;
  }

  async update(id: string, dto: any): Promise<Certificate> {
    const certificate = await this.certificateModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!certificate) throw new NotFoundException(`Certificate with ID ${id} not found`);
    return certificate;
  }

  async remove(id: string): Promise<void> {
    const result = await this.certificateModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException(`Certificate with ID ${id} not found`);
  }

  async findByUser(userProfileId: string): Promise<Certificate[]> {
    return this.certificateModel.find({ user_profile: userProfileId }).sort({ expiryDate: -1 }).exec();
  }
}
