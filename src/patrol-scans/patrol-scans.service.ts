import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PatrolScan, PatrolScanDocument } from './schemas/patrol-scan.schema';
import { CreatePatrolScanDto } from './dto/create-patrol-scan.dto';
import { UpdatePatrolScanDto } from './dto/update-patrol-scan.dto';

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
export class PatrolScansService {
  constructor(
    @InjectModel(PatrolScan.name)
    private patrolScanModel: Model<PatrolScanDocument>,
  ) {}

  async create(createPatrolScanDto: CreatePatrolScanDto): Promise<PatrolScan> {
    const patrolScan = new this.patrolScanModel(createPatrolScanDto);
    return patrolScan.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<PatrolScan>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.patrolScanModel
        .find()
        .populate('patrol')
        .populate('checkpoint')
        .sort({ scanTime: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.patrolScanModel.countDocuments(),
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

  async findOne(id: string): Promise<PatrolScan> {
    const patrolScan = await this.patrolScanModel
      .findById(id)
      .populate('patrol')
      .populate('checkpoint')
      .exec();
    if (!patrolScan) {
      throw new NotFoundException(`PatrolScan with ID ${id} not found`);
    }
    return patrolScan;
  }

  async update(id: string, updatePatrolScanDto: UpdatePatrolScanDto): Promise<PatrolScan> {
    const existingPatrolScan = await this.patrolScanModel
      .findByIdAndUpdate(id, updatePatrolScanDto, { new: true })
      .exec();
    if (!existingPatrolScan) {
      throw new NotFoundException(`PatrolScan with ID ${id} not found`);
    }
    return existingPatrolScan;
  }

  async remove(id: string): Promise<void> {
    const result = await this.patrolScanModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`PatrolScan with ID ${id} not found`);
    }
  }

  async findByPatrol(patrolId: string): Promise<PatrolScan[]> {
    return this.patrolScanModel
      .find({ patrol: patrolId })
      .populate('checkpoint')
      .sort({ scanTime: 1 })
      .exec();
  }

  async findByCheckpoint(checkpointId: string, startDate?: Date, endDate?: Date): Promise<PatrolScan[]> {
    const query: any = { checkpoint: checkpointId };
    if (startDate || endDate) {
      query.scanTime = {};
      if (startDate) query.scanTime.$gte = startDate;
      if (endDate) query.scanTime.$lte = endDate;
    }
    return this.patrolScanModel
      .find(query)
      .populate('patrol')
      .sort({ scanTime: -1 })
      .exec();
  }

  async findMissedScans(patrolId: string): Promise<PatrolScan[]> {
    return this.patrolScanModel
      .find({ patrol: patrolId, isMissed: true })
      .populate('checkpoint')
      .sort({ scanTime: 1 })
      .exec();
  }

  async findCompletedScans(patrolId: string): Promise<PatrolScan[]> {
    return this.patrolScanModel
      .find({ patrol: patrolId, isMissed: false })
      .populate('checkpoint')
      .sort({ scanTime: 1 })
      .exec();
  }

  async markAsMissed(scanId: string): Promise<PatrolScan> {
    const patrolScan = await this.patrolScanModel
      .findByIdAndUpdate(scanId, { isMissed: true }, { new: true })
      .exec();
    if (!patrolScan) {
      throw new NotFoundException(`PatrolScan with ID ${scanId} not found`);
    }
    return patrolScan;
  }

  async markAsCompleted(scanId: string): Promise<PatrolScan> {
    const patrolScan = await this.patrolScanModel
      .findByIdAndUpdate(scanId, { isMissed: false }, { new: true })
      .exec();
    if (!patrolScan) {
      throw new NotFoundException(`PatrolScan with ID ${scanId} not found`);
    }
    return patrolScan;
  }

  async getPatrolScanStatistics(patrolId: string): Promise<{
    totalScans: number;
    completedScans: number;
    missedScans: number;
    completionRate: number;
  }> {
    const totalScans = await this.patrolScanModel.countDocuments({ patrol: patrolId });
    const completedScans = await this.patrolScanModel.countDocuments({ patrol: patrolId, isMissed: false });
    const missedScans = await this.patrolScanModel.countDocuments({ patrol: patrolId, isMissed: true });
    const completionRate = totalScans > 0 ? (completedScans / totalScans) * 100 : 0;

    return {
      totalScans,
      completedScans,
      missedScans,
      completionRate: Math.round(completionRate * 100) / 100,
    };
  }
}
