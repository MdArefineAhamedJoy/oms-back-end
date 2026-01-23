import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

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
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name)
    private vehicleModel: Model<VehicleDocument>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = new this.vehicleModel(createVehicleDto);
    return vehicle.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Vehicle>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.vehicleModel
        .find()
        .populate('site')
        .populate('checkedInBy')
        .sort({ checkInTime: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.vehicleModel.countDocuments(),
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

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleModel
      .findById(id)
      .populate('site')
      .populate('checkedInBy')
      .exec();
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const existingVehicle = await this.vehicleModel
      .findByIdAndUpdate(id, updateVehicleDto, { new: true })
      .exec();
    if (!existingVehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return existingVehicle;
  }

  async remove(id: string): Promise<void> {
    const result = await this.vehicleModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
  }

  async findBySite(siteId: string, startDate?: Date, endDate?: Date): Promise<Vehicle[]> {
    const query: any = { site: siteId };
    if (startDate || endDate) {
      query.checkInTime = {};
      if (startDate) query.checkInTime.$gte = startDate;
      if (endDate) query.checkInTime.$lte = endDate;
    }
    return this.vehicleModel
      .find(query)
      .populate('checkedInBy')
      .sort({ checkInTime: -1 })
      .exec();
  }

  async findByStatus(status: string): Promise<Vehicle[]> {
    return this.vehicleModel
      .find({ parkingStatus: status })
      .populate('site')
      .populate('checkedInBy')
      .sort({ checkInTime: -1 })
      .exec();
  }

  async findByRegistrationNumber(registrationNumber: string): Promise<Vehicle | null> {
    return this.vehicleModel
      .findOne({ registrationNumber })
      .populate('site')
      .populate('checkedInBy')
      .exec();
  }

  async findCurrentlyParked(siteId: string): Promise<Vehicle[]> {
    return this.vehicleModel
      .find({ site: siteId, parkingStatus: 'PARKED' })
      .populate('checkedInBy')
      .sort({ checkInTime: -1 })
      .exec();
  }

  async findOverdueVehicles(): Promise<Vehicle[]> {
    return this.vehicleModel
      .find({ parkingStatus: 'OVERDUE' })
      .populate('site')
      .sort({ checkInTime: -1 })
      .exec();
  }

  async checkIn(vehicleId: string, checkInData: { checkInTime: Date; checkedInBy?: string; parkingSpot?: string }): Promise<Vehicle> {
    const vehicle = await this.vehicleModel.findByIdAndUpdate(
      vehicleId,
      {
        ...checkInData,
        parkingStatus: 'PARKED',
        checkOutTime: null,
      },
      { new: true }
    ).exec();
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }
    return vehicle;
  }

  async checkOut(vehicleId: string, checkOutData: { checkOutTime: Date; notes?: string }): Promise<Vehicle> {
    const vehicle = await this.vehicleModel.findByIdAndUpdate(
      vehicleId,
      {
        ...checkOutData,
        parkingStatus: 'EXITED',
      },
      { new: true }
    ).exec();
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }
    return vehicle;
  }

  async markAsOverdue(vehicleId: string): Promise<Vehicle> {
    const vehicle = await this.vehicleModel.findByIdAndUpdate(
      vehicleId,
      { parkingStatus: 'OVERDUE' },
      { new: true }
    ).exec();
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }
    return vehicle;
  }

  async findByOwner(ownerName: string): Promise<Vehicle[]> {
    return this.vehicleModel
      .find({ ownerName: new RegExp(ownerName, 'i') })
      .populate('site')
      .sort({ checkInTime: -1 })
      .exec();
  }

  async findByParkingSpot(siteId: string, parkingSpot: string): Promise<Vehicle | null> {
    return this.vehicleModel
      .findOne({ site: siteId, parkingSpot, parkingStatus: 'PARKED' })
      .populate('checkedInBy')
      .exec();
  }

  async getVehicleStatistics(siteId?: string): Promise<{
    totalToday: number;
    currentlyParked: number;
    exited: number;
    overdue: number;
    capacity: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const matchQuery: any = {
      checkInTime: { $gte: today, $lt: tomorrow },
    };
    if (siteId) {
      matchQuery.site = siteId;
    }

    const [totalToday, currentlyParked, exited, overdue] = await Promise.all([
      this.vehicleModel.countDocuments(matchQuery),
      this.vehicleModel.countDocuments({ ...matchQuery, parkingStatus: 'PARKED' }),
      this.vehicleModel.countDocuments({ ...matchQuery, parkingStatus: 'EXITED' }),
      this.vehicleModel.countDocuments({ parkingStatus: 'OVERDUE' }),
    ]);

    // Assuming a default capacity of 100 vehicles per site
    const capacity = 100;

    return {
      totalToday,
      currentlyParked,
      exited,
      overdue,
      capacity,
    };
  }
}
