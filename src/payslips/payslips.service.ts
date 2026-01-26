import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaySlip, PaySlipDocument } from './schemas/payslip.schema';

@Injectable()
export class PaySlipsService {
  constructor(@InjectModel(PaySlip.name) private paySlipModel: Model<PaySlipDocument>) {}

  async create(dto: any): Promise<PaySlip> {
    const paySlip = new this.paySlipModel(dto);
    return paySlip.save();
  }

  async findAll(page = 1, limit = 10, filters: any = {}) {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters.user) query.user = filters.user;
    if (filters.year) query.year = filters.year;
    if (filters.month) query.month = filters.month;

    const [data, total] = await Promise.all([
      this.paySlipModel.find(query).sort({ payDate: -1 }).skip(skip).limit(limit).exec(),
      this.paySlipModel.countDocuments(query),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<PaySlip> {
    const paySlip = await this.paySlipModel.findById(id).exec();
    if (!paySlip) throw new NotFoundException(`PaySlip with ID ${id} not found`);
    return paySlip;
  }

  async update(id: string, dto: any): Promise<PaySlip> {
    const paySlip = await this.paySlipModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!paySlip) throw new NotFoundException(`PaySlip with ID ${id} not found`);
    return paySlip;
  }

  async remove(id: string): Promise<void> {
    const result = await this.paySlipModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException(`PaySlip with ID ${id} not found`);
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.paySlipModel.find({ user: userId }).sort({ payDate: -1 }).skip(skip).limit(limit).exec(),
      this.paySlipModel.countDocuments({ user: userId }),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findByMonthAndYear(month: string, year: number): Promise<PaySlip[]> {
    return this.paySlipModel.find({ month, year }).sort({ payDate: -1 }).exec();
  }

  async findByUserAndMonth(userId: string, month: string, year: number): Promise<PaySlip | null> {
    return this.paySlipModel.findOne({ user: userId, month, year }).exec();
  }
}
