import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Checkpoint, CheckpointDocument } from './schemas/checkpoint.schema';
import { CreateCheckpointDto } from './dto/create-checkpoint.dto';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';

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
export class CheckpointsService {
  constructor(
    @InjectModel(Checkpoint.name)
    private checkpointModel: Model<CheckpointDocument>,
  ) {}

  async create(createCheckpointDto: CreateCheckpointDto): Promise<Checkpoint> {
    const checkpoint = new this.checkpointModel(createCheckpointDto);
    return checkpoint.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Checkpoint>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.checkpointModel
        .find()
        .populate('site')
        .sort({ priorityOrder: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.checkpointModel.countDocuments(),
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

  async findOne(id: string): Promise<Checkpoint> {
    const checkpoint = await this.checkpointModel
      .findById(id)
      .populate('site')
      .exec();
    if (!checkpoint) {
      throw new NotFoundException(`Checkpoint with ID ${id} not found`);
    }
    return checkpoint;
  }

  async update(id: string, updateCheckpointDto: UpdateCheckpointDto): Promise<Checkpoint> {
    const existingCheckpoint = await this.checkpointModel
      .findByIdAndUpdate(id, updateCheckpointDto, { new: true })
      .exec();
    if (!existingCheckpoint) {
      throw new NotFoundException(`Checkpoint with ID ${id} not found`);
    }
    return existingCheckpoint;
  }

  async remove(id: string): Promise<void> {
    const result = await this.checkpointModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Checkpoint with ID ${id} not found`);
    }
  }

  async findBySite(siteId: string): Promise<Checkpoint[]> {
    return this.checkpointModel
      .find({ site: siteId, isActive: true })
      .sort({ priorityOrder: 1, name: 1 })
      .exec();
  }

  async findByQrCode(qrCode: string): Promise<Checkpoint> {
    const checkpoint = await this.checkpointModel
      .findOne({ qrCode })
      .populate('site')
      .exec();
    if (!checkpoint) {
      throw new NotFoundException(`Checkpoint with QR Code ${qrCode} not found`);
    }
    return checkpoint;
  }

  async findActive(): Promise<Checkpoint[]> {
    return this.checkpointModel
      .find({ isActive: true })
      .populate('site')
      .sort({ priorityOrder: 1, name: 1 })
      .exec();
  }

  async findNearby(lat: number, lng: number, maxDistanceMeters: number = 100): Promise<Checkpoint[]> {
    return this.checkpointModel
      .find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: maxDistanceMeters,
          },
        },
        isActive: true,
      })
      .populate('site')
      .exec();
  }
}
