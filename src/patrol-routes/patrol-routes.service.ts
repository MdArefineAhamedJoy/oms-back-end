import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PatrolRoute, PatrolRouteDocument } from './schemas/patrol-route.schema';
import { CreatePatrolRouteDto } from './dto/create-patrol-route.dto';
import { UpdatePatrolRouteDto } from './dto/update-patrol-route.dto';

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
export class PatrolRoutesService {
  constructor(
    @InjectModel(PatrolRoute.name)
    private patrolRouteModel: Model<PatrolRouteDocument>,
  ) {}

  async create(createPatrolRouteDto: CreatePatrolRouteDto): Promise<PatrolRoute> {
    const patrolRoute = new this.patrolRouteModel(createPatrolRouteDto);
    return patrolRoute.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<PatrolRoute>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.patrolRouteModel
        .find()
        .populate('site')
        .sort({ priorityOrder: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.patrolRouteModel.countDocuments(),
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

  async findOne(id: string): Promise<PatrolRoute> {
    const patrolRoute = await this.patrolRouteModel
      .findById(id)
      .populate('site')
      .exec();
    if (!patrolRoute) {
      throw new NotFoundException(`PatrolRoute with ID ${id} not found`);
    }
    return patrolRoute;
  }

  async update(id: string, updatePatrolRouteDto: UpdatePatrolRouteDto): Promise<PatrolRoute> {
    const existingPatrolRoute = await this.patrolRouteModel
      .findByIdAndUpdate(id, updatePatrolRouteDto, { new: true })
      .exec();
    if (!existingPatrolRoute) {
      throw new NotFoundException(`PatrolRoute with ID ${id} not found`);
    }
    return existingPatrolRoute;
  }

  async remove(id: string): Promise<void> {
    const result = await this.patrolRouteModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`PatrolRoute with ID ${id} not found`);
    }
  }

  async findBySite(siteId: string): Promise<PatrolRoute[]> {
    return this.patrolRouteModel
      .find({ site: siteId, isActive: true })
      .sort({ priorityOrder: 1, name: 1 })
      .exec();
  }

  async findActive(): Promise<PatrolRoute[]> {
    return this.patrolRouteModel
      .find({ isActive: true })
      .populate('site')
      .sort({ priorityOrder: 1, name: 1 })
      .exec();
  }
}
