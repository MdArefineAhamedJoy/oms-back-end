import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OccurrenceBook, OccurrenceBookDocument } from './schemas/occurrence-book.schema';
import { EntryType, Priority, AcknowledgmentStatus, FollowUpStatus } from './schemas/occurrence-book.schema';

@Injectable()
export class OccurrenceBooksService {
  constructor(@InjectModel(OccurrenceBook.name) private occurrenceBookModel: Model<OccurrenceBookDocument>) {}

  async create(dto: any): Promise<OccurrenceBook> {
    const occurrenceBook = new this.occurrenceBookModel(dto);
    return occurrenceBook.save();
  }

  async findAll(page = 1, limit = 10, filters: any = {}) {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters.tenant) query.tenant = filters.tenant;
    if (filters.site) query.site = filters.site;
    if (filters.entryType) query.entryType = filters.entryType;
    if (filters.priority) query.priority = filters.priority;
    if (filters.acknowledgmentStatus) query.acknowledgmentStatus = filters.acknowledgmentStatus;
    if (filters.followUpStatus) query.followUpStatus = filters.followUpStatus;
    if (filters.archived !== undefined) query.archived = filters.archached;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;

    const [data, total] = await Promise.all([
      this.occurrenceBookModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.occurrenceBookModel.countDocuments(query),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<OccurrenceBook> {
    const occurrenceBook = await this.occurrenceBookModel.findById(id).exec();
    if (!occurrenceBook) throw new NotFoundException(`OccurrenceBook with ID ${id} not found`);
    return occurrenceBook;
  }

  async update(id: string, dto: any): Promise<OccurrenceBook> {
    const occurrenceBook = await this.occurrenceBookModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!occurrenceBook) throw new NotFoundException(`OccurrenceBook with ID ${id} not found`);
    return occurrenceBook;
  }

  async remove(id: string): Promise<void> {
    const result = await this.occurrenceBookModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException(`OccurrenceBook with ID ${id} not found`);
  }

  async findBySite(siteId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.occurrenceBookModel.find({ site: siteId }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.occurrenceBookModel.countDocuments({ site: siteId }),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findByShift(shiftId: string): Promise<OccurrenceBook[]> {
    return this.occurrenceBookModel.find({ shift: shiftId }).sort({ createdAt: -1 }).exec();
  }

  async findByEntryType(entryType: EntryType): Promise<OccurrenceBook[]> {
    return this.occurrenceBookModel.find({ entryType }).sort({ createdAt: -1 }).exec();
  }

  async findByPriority(priority: Priority): Promise<OccurrenceBook[]> {
    return this.occurrenceBookModel.find({ priority }).sort({ createdAt: -1 }).exec();
  }

  async findPendingAcknowledgments(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.occurrenceBookModel
        .find({
          acknowledgmentRequired: true,
          acknowledgmentStatus: AcknowledgmentStatus.PENDING,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.occurrenceBookModel.countDocuments({
        acknowledgmentRequired: true,
        acknowledgmentStatus: AcknowledgmentStatus.PENDING,
      }),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findPendingFollowUps(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.occurrenceBookModel
        .find({
          followUpRequired: true,
          followUpStatus: { $in: [FollowUpStatus.PENDING, FollowUpStatus.IN_PROGRESS] },
        })
        .sort({ followUpDate: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.occurrenceBookModel.countDocuments({
        followUpRequired: true,
        followUpStatus: { $in: [FollowUpStatus.PENDING, FollowUpStatus.IN_PROGRESS] },
      }),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async acknowledge(id: string, acknowledgedBy: string): Promise<OccurrenceBook> {
    const occurrenceBook = await this.occurrenceBookModel
      .findByIdAndUpdate(
        id,
        {
          acknowledgmentStatus: AcknowledgmentStatus.ACKNOWLEDGED,
          acknowledgedBy,
          acknowledgedAt: new Date(),
        },
        { new: true },
      )
      .exec();
    if (!occurrenceBook) throw new NotFoundException(`OccurrenceBook with ID ${id} not found`);
    return occurrenceBook;
  }

  async updateFollowUpStatus(id: string, status: FollowUpStatus, notes?: string): Promise<OccurrenceBook> {
    const updateData: any = { followUpStatus: status };
    if (notes) updateData.followUpNotes = notes;
    if (status === FollowUpStatus.COMPLETED) updateData.followUpDate = new Date();

    const occurrenceBook = await this.occurrenceBookModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!occurrenceBook) throw new NotFoundException(`OccurrenceBook with ID ${id} not found`);
    return occurrenceBook;
  }

  async archive(id: string, reason: string, archivedBy: string): Promise<OccurrenceBook> {
    const occurrenceBook = await this.occurrenceBookModel
      .findByIdAndUpdate(
        id,
        {
          archived: true,
          archivedReason: reason,
          archivedBy,
          archivedAt: new Date(),
        },
        { new: true },
      )
      .exec();
    if (!occurrenceBook) throw new NotFoundException(`OccurrenceBook with ID ${id} not found`);
    return occurrenceBook;
  }

  async generateEntryNumber(tenantId: string, siteId: string): Promise<string> {
    const count = await this.occurrenceBookModel.countDocuments({ tenant: tenantId, site: siteId });
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `OB-${year}${month}${day}-${(count + 1).toString().padStart(4, '0')}`;
  }

  async getByDateRange(siteId: string, startDate: Date, endDate: Date): Promise<OccurrenceBook[]> {
    return this.occurrenceBookModel
      .find({
        site: siteId,
        occurrenceDateTime: { $gte: startDate, $lte: endDate },
      })
      .sort({ occurrenceDateTime: -1 })
      .exec();
  }
}
