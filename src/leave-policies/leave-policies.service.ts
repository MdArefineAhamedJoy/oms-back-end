import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeavePolicy, LeavePolicyDocument } from './schemas/leave-policy.schema';
import { CreateLeavePolicyDto } from './dto/create-leave-policy.dto';
import { UpdateLeavePolicyDto } from './dto/update-leave-policy.dto';

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
export class LeavePoliciesService {
  constructor(
    @InjectModel(LeavePolicy.name)
    private leavePolicyModel: Model<LeavePolicyDocument>,
  ) {}

  async create(createLeavePolicyDto: CreateLeavePolicyDto): Promise<LeavePolicy> {
    const leavePolicy = new this.leavePolicyModel(createLeavePolicyDto);
    return leavePolicy.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<LeavePolicy>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.leavePolicyModel.find().skip(skip).limit(limit).exec(),
      this.leavePolicyModel.countDocuments(),
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

  async findOne(id: string): Promise<LeavePolicy> {
    const leavePolicy = await this.leavePolicyModel.findById(id).exec();
    if (!leavePolicy) {
      throw new NotFoundException(`LeavePolicy with ID ${id} not found`);
    }
    return leavePolicy;
  }

  async update(id: string, updateLeavePolicyDto: UpdateLeavePolicyDto): Promise<LeavePolicy> {
    const existingLeavePolicy = await this.leavePolicyModel
      .findByIdAndUpdate(id, updateLeavePolicyDto, { new: true })
      .exec();
    if (!existingLeavePolicy) {
      throw new NotFoundException(`LeavePolicy with ID ${id} not found`);
    }
    return existingLeavePolicy;
  }

  async remove(id: string): Promise<void> {
    const result = await this.leavePolicyModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`LeavePolicy with ID ${id} not found`);
    }
  }
}
