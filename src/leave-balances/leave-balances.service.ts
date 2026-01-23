import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeaveBalance, LeaveBalanceDocument } from './schemas/leave-balance.schema';
import { CreateLeaveBalanceDto } from './dto/create-leave-balance.dto';
import { UpdateLeaveBalanceDto } from './dto/update-leave-balance.dto';

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
export class LeaveBalancesService {
  constructor(
    @InjectModel(LeaveBalance.name)
    private leaveBalanceModel: Model<LeaveBalanceDocument>,
  ) {}

  async create(createLeaveBalanceDto: CreateLeaveBalanceDto): Promise<LeaveBalance> {
    const leaveBalance = new this.leaveBalanceModel(createLeaveBalanceDto);
    return leaveBalance.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<LeaveBalance>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.leaveBalanceModel
        .find()
        .populate('userProfile')
        .sort({ year: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.leaveBalanceModel.countDocuments(),
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

  async findOne(id: string): Promise<LeaveBalance> {
    const leaveBalance = await this.leaveBalanceModel
      .findById(id)
      .populate('userProfile')
      .exec();
    if (!leaveBalance) {
      throw new NotFoundException(`LeaveBalance with ID ${id} not found`);
    }
    return leaveBalance;
  }

  async update(id: string, updateLeaveBalanceDto: UpdateLeaveBalanceDto): Promise<LeaveBalance> {
    const existingLeaveBalance = await this.leaveBalanceModel
      .findByIdAndUpdate(id, updateLeaveBalanceDto, { new: true })
      .exec();
    if (!existingLeaveBalance) {
      throw new NotFoundException(`LeaveBalance with ID ${id} not found`);
    }
    return existingLeaveBalance;
  }

  async remove(id: string): Promise<void> {
    const result = await this.leaveBalanceModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`LeaveBalance with ID ${id} not found`);
    }
  }

  async findByUser(userProfileId: string): Promise<LeaveBalance[]> {
    return this.leaveBalanceModel
      .find({ userProfile: userProfileId })
      .sort({ year: -1 })
      .exec();
  }

  async findByUserAndYear(userProfileId: string, year: number): Promise<LeaveBalance | null> {
    return this.leaveBalanceModel
      .findOne({ userProfile: userProfileId, year })
      .exec();
  }

  async findByYear(year: number): Promise<LeaveBalance[]> {
    return this.leaveBalanceModel
      .find({ year })
      .populate('userProfile')
      .exec();
  }

  async getCurrentBalance(userProfileId: string): Promise<LeaveBalance> {
    const currentYear = new Date().getFullYear();
    let balance = await this.leaveBalanceModel
      .findOne({ userProfile: userProfileId, year: currentYear })
      .exec();

    if (!balance) {
      // Create default balance for current year
      balance = await this.create({
        userProfile: userProfileId,
        year: currentYear,
        annualBalance: 14,
        sickBalance: 14,
        otherBalance: 3,
        carriedForward: 0,
      });
    }

    return balance;
  }

  async updateBalance(userProfileId: string, leaveType: string, days: number): Promise<LeaveBalance> {
    const currentYear = new Date().getFullYear();
    const balance = await this.findByUserAndYear(userProfileId, currentYear);

    if (!balance) {
      throw new NotFoundException(`Leave balance not found for user ${userProfileId} in year ${currentYear}`);
    }

    const updateField: any = {};
    switch (leaveType.toUpperCase()) {
      case 'ANNUAL':
        updateField.annualBalance = Math.max(0, balance.annualBalance - days);
        break;
      case 'SICK':
        updateField.sickBalance = Math.max(0, balance.sickBalance - days);
        break;
      case 'MATERNITY':
      case 'PATERNITY':
      case 'COMPASSIONATE':
      case 'UNPAID':
        updateField.otherBalance = Math.max(0, balance.otherBalance - days);
        break;
      default:
        throw new Error(`Invalid leave type: ${leaveType}`);
    }

    return this.leaveBalanceModel.findByIdAndUpdate(
      balance._id,
      updateField,
      { new: true }
    ).exec();
  }

  async addCarriedForward(userProfileId: string, year: number, days: number): Promise<LeaveBalance> {
    const balance = await this.findByUserAndYear(userProfileId, year);

    if (!balance) {
      throw new NotFoundException(`Leave balance not found for user ${userProfileId} in year ${year}`);
    }

    return this.leaveBalanceModel.findByIdAndUpdate(
      balance._id,
      { carriedForward: days },
      { new: true }
    ).exec();
  }

  async getLeaveSummary(userProfileId: string): Promise<{
    currentYear: number;
    annualBalance: number;
    sickBalance: number;
    otherBalance: number;
    carriedForward: number;
    totalAvailable: number;
    history: Array<{ year: number; annual: number; sick: number; other: number }>;
  }> {
    const currentBalance = await this.getCurrentBalance(userProfileId);
    const history = await this.leaveBalanceModel
      .find({ userProfile: userProfileId })
      .sort({ year: -1 })
      .limit(5)
      .exec();

    return {
      currentYear: currentBalance.year,
      annualBalance: currentBalance.annualBalance,
      sickBalance: currentBalance.sickBalance,
      otherBalance: currentBalance.otherBalance,
      carriedForward: currentBalance.carriedForward,
      totalAvailable: currentBalance.annualBalance + currentBalance.carriedForward,
      history: history.map((h) => ({
        year: h.year,
        annual: h.annualBalance,
        sick: h.sickBalance,
        other: h.otherBalance,
      })),
    };
  }

  async carryForwardFromPreviousYear(userProfileId: string): Promise<LeaveBalance> {
    const previousYear = new Date().getFullYear() - 1;
    const currentYear = new Date().getFullYear();

    const previousBalance = await this.findByUserAndYear(userProfileId, previousYear);
    let carriedForwardDays = 0;

    if (previousBalance) {
      // Calculate remaining annual leave (max carry forward typically 5-10 days)
      carriedForwardDays = Math.min(previousBalance.annualBalance, 10);
    }

    let currentBalance = await this.findByUserAndYear(userProfileId, currentYear);

    if (!currentBalance) {
      currentBalance = await this.create({
        userProfile: userProfileId,
        year: currentYear,
        annualBalance: 14,
        sickBalance: 14,
        otherBalance: 3,
        carriedForward: carriedForwardDays,
      });
    } else {
      currentBalance = await this.leaveBalanceModel.findByIdAndUpdate(
        currentBalance._id,
        { carriedForward: carriedForwardDays },
        { new: true }
      ).exec();
    }

    return currentBalance;
  }

  async getLowBalanceAlerts(threshold: number = 3): Promise<LeaveBalance[]> {
    const currentYear = new Date().getFullYear();
    return this.leaveBalanceModel
      .find({
        year: currentYear,
        $or: [
          { annualBalance: { $lte: threshold } },
          { sickBalance: { $lte: threshold } },
        ],
      })
      .populate('userProfile')
      .exec();
  }

  async resetAnnualBalancesForYear(year: number): Promise<number> {
    const result = await this.leaveBalanceModel.updateMany(
      { year },
      {
        annualBalance: 14,
        sickBalance: 14,
        otherBalance: 3,
      }
    ).exec();
    return result.modifiedCount;
  }
}
