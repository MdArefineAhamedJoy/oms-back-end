import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeaveRequest, LeaveRequestDocument } from './schemas/leave-request.schema';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';

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
export class LeaveRequestsService {
  constructor(
    @InjectModel(LeaveRequest.name)
    private leaveRequestModel: Model<LeaveRequestDocument>,
  ) {}

  async create(createLeaveRequestDto: CreateLeaveRequestDto): Promise<LeaveRequest> {
    const leaveRequest = new this.leaveRequestModel(createLeaveRequestDto);
    return leaveRequest.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<LeaveRequest>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.leaveRequestModel
        .find()
        .populate('user')
        .populate('approvedBy')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.leaveRequestModel.countDocuments(),
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

  async findOne(id: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestModel
      .findById(id)
      .populate('user')
      .populate('approvedBy')
      .exec();
    if (!leaveRequest) {
      throw new NotFoundException(`LeaveRequest with ID ${id} not found`);
    }
    return leaveRequest;
  }

  async update(id: string, updateLeaveRequestDto: UpdateLeaveRequestDto): Promise<LeaveRequest> {
    const existingLeaveRequest = await this.leaveRequestModel
      .findByIdAndUpdate(id, updateLeaveRequestDto, { new: true })
      .exec();
    if (!existingLeaveRequest) {
      throw new NotFoundException(`LeaveRequest with ID ${id} not found`);
    }
    return existingLeaveRequest;
  }

  async remove(id: string): Promise<void> {
    const result = await this.leaveRequestModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`LeaveRequest with ID ${id} not found`);
    }
  }

  async findByUser(userId: string): Promise<LeaveRequest[]> {
    return this.leaveRequestModel
      .find({ user: userId })
      .populate('approvedBy')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByStatus(status: string): Promise<LeaveRequest[]> {
    return this.leaveRequestModel
      .find({ requestStatus: status })
      .populate('user')
      .populate('approvedBy')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByLeaveType(leaveType: string): Promise<LeaveRequest[]> {
    return this.leaveRequestModel
      .find({ leaveType })
      .populate('user')
      .populate('approvedBy')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<LeaveRequest[]> {
    return this.leaveRequestModel
      .find({
        $or: [
          { startDate: { $gte: startDate, $lte: endDate } },
          { endDate: { $gte: startDate, $lte: endDate } },
          { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
        ],
      })
      .populate('user')
      .populate('approvedBy')
      .sort({ startDate: 1 })
      .exec();
  }

  async findPendingRequests(): Promise<LeaveRequest[]> {
    return this.leaveRequestModel
      .find({ requestStatus: 'PENDING' })
      .populate('user')
      .sort({ createdAt: 1 })
      .exec();
  }

  async approve(id: string, approverId: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestModel
      .findByIdAndUpdate(
        id,
        {
          requestStatus: 'APPROVED',
          approvedBy: approverId,
          approvedAt: new Date(),
        },
        { new: true }
      )
      .populate('user')
      .populate('approvedBy')
      .exec();
    if (!leaveRequest) {
      throw new NotFoundException(`LeaveRequest with ID ${id} not found`);
    }
    return leaveRequest;
  }

  async reject(id: string, approverId: string, rejectionReason: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestModel
      .findByIdAndUpdate(
        id,
        {
          requestStatus: 'REJECTED',
          approvedBy: approverId,
          rejectionReason,
        },
        { new: true }
      )
      .populate('user')
      .populate('approvedBy')
      .exec();
    if (!leaveRequest) {
      throw new NotFoundException(`LeaveRequest with ID ${id} not found`);
    }
    return leaveRequest;
  }

  async cancel(id: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestModel
      .findByIdAndUpdate(
        id,
        { requestStatus: 'CANCELLED' },
        { new: true }
      )
      .populate('user')
      .populate('approvedBy')
      .exec();
    if (!leaveRequest) {
      throw new NotFoundException(`LeaveRequest with ID ${id} not found`);
    }
    return leaveRequest;
  }

  async getLeaveStatistics(userId?: string): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
    byType: Record<string, number>;
    totalDays: number;
  }> {
    const matchQuery = userId ? { user: userId } : {};

    const [total, pending, approved, rejected, cancelled, byType, allRequests] = await Promise.all([
      this.leaveRequestModel.countDocuments(matchQuery),
      this.leaveRequestModel.countDocuments({ ...matchQuery, requestStatus: 'PENDING' }),
      this.leaveRequestModel.countDocuments({ ...matchQuery, requestStatus: 'APPROVED' }),
      this.leaveRequestModel.countDocuments({ ...matchQuery, requestStatus: 'REJECTED' }),
      this.leaveRequestModel.countDocuments({ ...matchQuery, requestStatus: 'CANCELLED' }),
      this.leaveRequestModel.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$leaveType', count: { $sum: 1 } } },
      ]),
      this.leaveRequestModel.find(matchQuery),
    ]);

    const typeMap: Record<string, number> = {};
    byType.forEach((item: any) => {
      typeMap[item._id] = item.count;
    });

    const totalDays = allRequests.reduce((sum, req) => sum + (req.totalDays || 0), 0);

    return {
      total,
      pending,
      approved,
      rejected,
      cancelled,
      byType: typeMap,
      totalDays,
    };
  }

  async findUpcomingLeave(userId?: string, days: number = 30): Promise<LeaveRequest[]> {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);

    const query: any = {
      requestStatus: 'APPROVED',
      startDate: { $gte: now, $lte: future },
    };
    if (userId) {
      query.user = userId;
    }

    return this.leaveRequestModel
      .find(query)
      .populate('user')
      .sort({ startDate: 1 })
      .exec();
  }
}
