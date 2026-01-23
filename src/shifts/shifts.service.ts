import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shift, ShiftDocument } from './schemas/shift.schema';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

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
export class ShiftsService {
  constructor(
    @InjectModel(Shift.name)
    private shiftModel: Model<ShiftDocument>,
  ) {}

  async create(createShiftDto: CreateShiftDto): Promise<Shift> {
    const shift = new this.shiftModel(createShiftDto);
    return shift.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Shift>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.shiftModel
        .find()
        .populate('tenant')
        .populate('site')
        .populate('user')
        .populate('shiftType')
        .populate('adjustedBy')
        .sort({ shiftDate: -1, startTime: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.shiftModel.countDocuments(),
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

  async findOne(id: string): Promise<Shift> {
    const shift = await this.shiftModel
      .findById(id)
      .populate('tenant')
      .populate('site')
      .populate('user')
      .populate('shiftType')
      .populate('adjustedBy')
      .exec();
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    return shift;
  }

  async update(id: string, updateShiftDto: UpdateShiftDto): Promise<Shift> {
    const existingShift = await this.shiftModel
      .findByIdAndUpdate(id, updateShiftDto, { new: true })
      .exec();
    if (!existingShift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    return existingShift;
  }

  async remove(id: string): Promise<void> {
    const result = await this.shiftModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
  }

  async findByUser(userId: string, startDate?: Date, endDate?: Date): Promise<Shift[]> {
    const query: any = { user: userId };
    if (startDate || endDate) {
      query.shiftDate = {};
      if (startDate) query.shiftDate.$gte = startDate;
      if (endDate) query.shiftDate.$lte = endDate;
    }
    return this.shiftModel
      .find(query)
      .populate('site')
      .populate('shiftType')
      .sort({ shiftDate: -1, startTime: -1 })
      .exec();
  }

  async findBySite(siteId: string, startDate?: Date, endDate?: Date): Promise<Shift[]> {
    const query: any = { site: siteId };
    if (startDate || endDate) {
      query.shiftDate = {};
      if (startDate) query.shiftDate.$gte = startDate;
      if (endDate) query.shiftDate.$lte = endDate;
    }
    return this.shiftModel
      .find(query)
      .populate('user')
      .populate('shiftType')
      .sort({ shiftDate: -1, startTime: -1 })
      .exec();
  }

  async findByStatus(status: string): Promise<Shift[]> {
    return this.shiftModel
      .find({ shiftStatus: status })
      .populate('tenant')
      .populate('site')
      .populate('user')
      .populate('shiftType')
      .sort({ shiftDate: -1, startTime: -1 })
      .exec();
  }

  async findByTenant(tenantId: string, page: number = 1, limit: number = 10): Promise<PaginationResult<Shift>> {
    const skip = (page - 1) * limit;
    const query = { tenant: tenantId };
    const [data, total] = await Promise.all([
      this.shiftModel
        .find(query)
        .populate('site')
        .populate('user')
        .populate('shiftType')
        .sort({ shiftDate: -1, startTime: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.shiftModel.countDocuments(query),
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

  async findOngoingShifts(): Promise<Shift[]> {
    return this.shiftModel
      .find({ shiftStatus: 'ONGOING' })
      .populate('site')
      .populate('user')
      .populate('shiftType')
      .exec();
  }

  async checkIn(shiftId: string, checkInData: { checkInTime: Date; checkInLocation?: { lat: number; lng: number }; checkInPhoto?: string; checkInNote?: string }): Promise<Shift> {
    const shift = await this.shiftModel.findByIdAndUpdate(
      shiftId,
      { ...checkInData, shiftStatus: 'ONGOING' },
      { new: true }
    ).exec();
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${shiftId} not found`);
    }
    return shift;
  }

  async checkOut(shiftId: string, checkOutData: { checkOutTime: Date; checkOutLocation?: { lat: number; lng: number }; checkOutPhoto?: string; checkOutNote?: string }): Promise<Shift> {
    const shift = await this.shiftModel.findByIdAndUpdate(
      shiftId,
      { ...checkOutData, shiftStatus: 'COMPLETED' },
      { new: true }
    ).exec();
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${shiftId} not found`);
    }
    return shift;
  }

  async startBreak(shiftId: string): Promise<Shift> {
    const shift = await this.shiftModel.findByIdAndUpdate(
      shiftId,
      { breakStartTime: new Date() },
      { new: true }
    ).exec();
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${shiftId} not found`);
    }
    return shift;
  }

  async endBreak(shiftId: string): Promise<Shift> {
    const shift = await this.shiftModel.findByIdAndUpdate(
      shiftId,
      { breakEndTime: new Date() },
      { new: true }
    ).exec();
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${shiftId} not found`);
    }
    return shift;
  }
}
