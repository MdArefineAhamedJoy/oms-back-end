import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visitor, VisitorDocument } from './schemas/visitor.schema';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';

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
export class VisitorsService {
  constructor(
    @InjectModel(Visitor.name)
    private visitorModel: Model<VisitorDocument>,
  ) {}

  async create(createVisitorDto: CreateVisitorDto): Promise<Visitor> {
    const visitor = new this.visitorModel(createVisitorDto);
    return visitor.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Visitor>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.visitorModel
        .find()
        .populate('site')
        .populate('checkedInBy')
        .sort({ checkInTime: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.visitorModel.countDocuments(),
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

  async findOne(id: string): Promise<Visitor> {
    const visitor = await this.visitorModel
      .findById(id)
      .populate('site')
      .populate('checkedInBy')
      .exec();
    if (!visitor) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }
    return visitor;
  }

  async update(id: string, updateVisitorDto: UpdateVisitorDto): Promise<Visitor> {
    const existingVisitor = await this.visitorModel
      .findByIdAndUpdate(id, updateVisitorDto, { new: true })
      .exec();
    if (!existingVisitor) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }
    return existingVisitor;
  }

  async remove(id: string): Promise<void> {
    const result = await this.visitorModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }
  }

  async findBySite(siteId: string, startDate?: Date, endDate?: Date): Promise<Visitor[]> {
    const query: any = { site: siteId };
    if (startDate || endDate) {
      query.checkInTime = {};
      if (startDate) query.checkInTime.$gte = startDate;
      if (endDate) query.checkInTime.$lte = endDate;
    }
    return this.visitorModel
      .find(query)
      .populate('checkedInBy')
      .sort({ checkInTime: -1 })
      .exec();
  }

  async findByStatus(status: string): Promise<Visitor[]> {
    return this.visitorModel
      .find({ status })
      .populate('site')
      .populate('checkedInBy')
      .sort({ checkInTime: -1 })
      .exec();
  }

  async findByVisitorType(visitorType: string): Promise<Visitor[]> {
    return this.visitorModel
      .find({ visitorType })
      .populate('site')
      .sort({ checkInTime: -1 })
      .exec();
  }

  async findCurrentlyOnSite(siteId: string): Promise<Visitor[]> {
    return this.visitorModel
      .find({ site: siteId, status: 'CHECKED_IN' })
      .populate('checkedInBy')
      .sort({ checkInTime: -1 })
      .exec();
  }

  async findOverdueVisitors(): Promise<Visitor[]> {
    return this.visitorModel
      .find({ status: 'OVERDUE' })
      .populate('site')
      .sort({ checkInTime: -1 })
      .exec();
  }

  async checkIn(visitorId: string, checkInData: { checkInTime: Date; checkedInBy?: string; signature?: string; photo?: string }): Promise<Visitor> {
    const visitor = await this.visitorModel.findByIdAndUpdate(
      visitorId,
      {
        ...checkInData,
        status: 'CHECKED_IN',
      },
      { new: true }
    ).exec();
    if (!visitor) {
      throw new NotFoundException(`Visitor with ID ${visitorId} not found`);
    }
    return visitor;
  }

  async checkOut(visitorId: string, checkOutData: { checkOutTime: Date; notes?: string }): Promise<Visitor> {
    const visitor = await this.visitorModel.findByIdAndUpdate(
      visitorId,
      {
        ...checkOutData,
        status: 'CHECKED_OUT',
      },
      { new: true }
    ).exec();
    if (!visitor) {
      throw new NotFoundException(`Visitor with ID ${visitorId} not found`);
    }
    return visitor;
  }

  async markAsOverdue(visitorId: string): Promise<Visitor> {
    const visitor = await this.visitorModel.findByIdAndUpdate(
      visitorId,
      { status: 'OVERDUE' },
      { new: true }
    ).exec();
    if (!visitor) {
      throw new NotFoundException(`Visitor with ID ${visitorId} not found`);
    }
    return visitor;
  }

  async findByIdentificationNumber(identificationNumber: string): Promise<Visitor[]> {
    return this.visitorModel
      .find({ identificationNumber })
      .populate('site')
      .sort({ checkInTime: -1 })
      .limit(20)
      .exec();
  }

  async findByHost(host: string): Promise<Visitor[]> {
    return this.visitorModel
      .find({ host })
      .populate('site')
      .sort({ checkInTime: -1 })
      .exec();
  }

  async getVisitorStatistics(siteId?: string): Promise<{
    totalToday: number;
    currentlyOnSite: number;
    checkedOut: number;
    overdue: number;
    byType: Record<string, number>;
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

    const [totalToday, currentlyOnSite, checkedOut, overdue, byType] = await Promise.all([
      this.visitorModel.countDocuments(matchQuery),
      this.visitorModel.countDocuments({ ...matchQuery, status: 'CHECKED_IN' }),
      this.visitorModel.countDocuments({ ...matchQuery, status: 'CHECKED_OUT' }),
      this.visitorModel.countDocuments({ status: 'OVERDUE' }),
      this.visitorModel.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$visitorType', count: { $sum: 1 } } },
      ]),
    ]);

    const typeMap: Record<string, number> = {};
    byType.forEach((item: any) => {
      typeMap[item._id] = item.count;
    });

    return {
      totalToday,
      currentlyOnSite,
      checkedOut,
      overdue,
      byType: typeMap,
    };
  }
}
