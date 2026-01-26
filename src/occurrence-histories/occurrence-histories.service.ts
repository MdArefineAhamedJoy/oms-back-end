import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OccurrenceHistory, OccurrenceHistoryDocument } from './schemas/occurrence-history.schema';

@Injectable()
export class OccurrenceHistoriesService {
  constructor(@InjectModel(OccurrenceHistory.name) private occurrenceHistoryModel: Model<OccurrenceHistoryDocument>) {}

  async create(dto: any): Promise<OccurrenceHistory> {
    const occurrenceHistory = new this.occurrenceHistoryModel(dto);
    return occurrenceHistory.save();
  }

  async findAll(page = 1, limit = 10, filters: any = {}) {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters.tenant) query.tenant = filters.tenant;
    if (filters.entryNumber) query.entryNumber = filters.entryNumber;
    if (filters.originalDocumentId) query.originalDocumentId = filters.originalDocumentId;

    const [data, total] = await Promise.all([
      this.occurrenceHistoryModel.find(query).sort({ archivedAt: -1 }).skip(skip).limit(limit).exec(),
      this.occurrenceHistoryModel.countDocuments(query),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<OccurrenceHistory> {
    const occurrenceHistory = await this.occurrenceHistoryModel.findById(id).exec();
    if (!occurrenceHistory) throw new NotFoundException(`OccurrenceHistory with ID ${id} not found`);
    return occurrenceHistory;
  }

  async update(id: string, dto: any): Promise<OccurrenceHistory> {
    const occurrenceHistory = await this.occurrenceHistoryModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!occurrenceHistory) throw new NotFoundException(`OccurrenceHistory with ID ${id} not found`);
    return occurrenceHistory;
  }

  async remove(id: string): Promise<void> {
    const result = await this.occurrenceHistoryModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException(`OccurrenceHistory with ID ${id} not found`);
  }

  async findByOriginalDocument(originalDocumentId: string): Promise<OccurrenceHistory[]> {
    return this.occurrenceHistoryModel.find({ originalDocumentId }).sort({ archivedAt: -1 }).exec();
  }

  async findByEntryNumber(entryNumber: string): Promise<OccurrenceHistory[]> {
    return this.occurrenceHistoryModel.find({ entryNumber }).sort({ archivedAt: -1 }).exec();
  }
}
