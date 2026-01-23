import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patrol, PatrolDocument } from './schemas/patrol.schema';
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { UpdatePatrolDto } from './dto/update-patrol.dto';

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
export class PatrolsService {
  constructor(
    @InjectModel(Patrol.name)
    private patrolModel: Model<PatrolDocument>,
  ) {}

  async create(createPatrolDto: CreatePatrolDto): Promise<Patrol> {
    const patrol = new this.patrolModel(createPatrolDto);
    return patrol.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Patrol>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.patrolModel
        .find()
        .populate('tenant')
        .populate('site')
        .populate('user')
        .populate('shift')
        .populate('patrolRoute')
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.patrolModel.countDocuments(),
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

  async findOne(id: string): Promise<Patrol> {
    const patrol = await this.patrolModel
      .findById(id)
      .populate('tenant')
      .populate('site')
      .populate('user')
      .populate('shift')
      .populate('patrolRoute')
      .exec();
    if (!patrol) {
      throw new NotFoundException(`Patrol with ID ${id} not found`);
    }
    return patrol;
  }

  async update(id: string, updatePatrolDto: UpdatePatrolDto): Promise<Patrol> {
    const existingPatrol = await this.patrolModel
      .findByIdAndUpdate(id, updatePatrolDto, { new: true })
      .exec();
    if (!existingPatrol) {
      throw new NotFoundException(`Patrol with ID ${id} not found`);
    }
    return existingPatrol;
  }

  async remove(id: string): Promise<void> {
    const result = await this.patrolModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Patrol with ID ${id} not found`);
    }
  }

  async findByUser(userId: string, startDate?: Date, endDate?: Date): Promise<Patrol[]> {
    const query: any = { user: userId };
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = startDate;
      if (endDate) query.startTime.$lte = endDate;
    }
    return this.patrolModel
      .find(query)
      .populate('site')
      .populate('shift')
      .populate('patrolRoute')
      .sort({ startTime: -1 })
      .exec();
  }

  async findBySite(siteId: string, startDate?: Date, endDate?: Date): Promise<Patrol[]> {
    const query: any = { site: siteId };
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = startDate;
      if (endDate) query.startTime.$lte = endDate;
    }
    return this.patrolModel
      .find(query)
      .populate('user')
      .populate('shift')
      .populate('patrolRoute')
      .sort({ startTime: -1 })
      .exec();
  }

  async findByShift(shiftId: string): Promise<Patrol[]> {
    return this.patrolModel
      .find({ shift: shiftId })
      .populate('site')
      .populate('user')
      .populate('patrolRoute')
      .sort({ startTime: -1 })
      .exec();
  }

  async findByStatus(status: string): Promise<Patrol[]> {
    return this.patrolModel
      .find({ patrolStatus: status })
      .populate('tenant')
      .populate('site')
      .populate('user')
      .populate('shift')
      .populate('patrolRoute')
      .sort({ startTime: -1 })
      .exec();
  }

  async findByTenant(tenantId: string, page: number = 1, limit: number = 10): Promise<PaginationResult<Patrol>> {
    const skip = (page - 1) * limit;
    const query = { tenant: tenantId };
    const [data, total] = await Promise.all([
      this.patrolModel
        .find(query)
        .populate('site')
        .populate('user')
        .populate('shift')
        .populate('patrolRoute')
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.patrolModel.countDocuments(query),
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

  async findInProgress(): Promise<Patrol[]> {
    return this.patrolModel
      .find({ patrolStatus: 'IN_PROGRESS' })
      .populate('site')
      .populate('user')
      .populate('shift')
      .populate('patrolRoute')
      .exec();
  }

  async startPatrol(patrolId: string): Promise<Patrol> {
    const patrol = await this.patrolModel.findByIdAndUpdate(
      patrolId,
      { startTime: new Date(), patrolStatus: 'IN_PROGRESS', patrolExecutionStatus: 'ONGOING' },
      { new: true }
    ).exec();
    if (!patrol) {
      throw new NotFoundException(`Patrol with ID ${patrolId} not found`);
    }
    return patrol;
  }

  async completePatrol(patrolId: string, endTime?: Date, notes?: string): Promise<Patrol> {
    const updateData: any = {
      endTime: endTime || new Date(),
      patrolStatus: 'COMPLETED',
      patrolExecutionStatus: 'COMPLETED',
    };
    if (notes) updateData.notes = notes;

    const patrol = await this.patrolModel.findByIdAndUpdate(
      patrolId,
      updateData,
      { new: true }
    ).exec();
    if (!patrol) {
      throw new NotFoundException(`Patrol with ID ${patrolId} not found`);
    }
    return patrol;
  }

  async abandonPatrol(patrolId: string, notes?: string): Promise<Patrol> {
    const updateData: any = {
      endTime: new Date(),
      patrolStatus: 'ABANDONED',
    };
    if (notes) updateData.notes = notes;

    const patrol = await this.patrolModel.findByIdAndUpdate(
      patrolId,
      updateData,
      { new: true }
    ).exec();
    if (!patrol) {
      throw new NotFoundException(`Patrol with ID ${patrolId} not found`);
    }
    return patrol;
  }

  async updateScanCounts(patrolId: string, totalScans: number, missedScans: number): Promise<Patrol> {
    const patrol = await this.patrolModel.findByIdAndUpdate(
      patrolId,
      { totalScans, missedScans },
      { new: true }
    ).exec();
    if (!patrol) {
      throw new NotFoundException(`Patrol with ID ${patrolId} not found`);
    }
    return patrol;
  }
}
