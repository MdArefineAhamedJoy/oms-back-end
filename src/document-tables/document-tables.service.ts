import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentTable, DocumentTableDocument } from './schemas/document-table.schema';

@Injectable()
export class DocumentTablesService {
  constructor(@InjectModel(DocumentTable.name) private documentTableModel: Model<DocumentTableDocument>) {}

  async create(dto: any): Promise<DocumentTable> {
    const doc = new this.documentTableModel(dto);
    return doc.save();
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.documentTableModel.find().populate('users_permissions_user').sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.documentTableModel.countDocuments(),
    ]);
    return { data, pagination: { page, pageSize: limit, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<DocumentTable> {
    const doc = await this.documentTableModel.findById(id).populate('users_permissions_user').exec();
    if (!doc) throw new NotFoundException(`DocumentTable with ID ${id} not found`);
    return doc;
  }

  async update(id: string, dto: any): Promise<DocumentTable> {
    const doc = await this.documentTableModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!doc) throw new NotFoundException(`DocumentTable with ID ${id} not found`);
    return doc;
  }

  async remove(id: string): Promise<void> {
    const result = await this.documentTableModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException(`DocumentTable with ID ${id} not found`);
  }

  async findByUser(userId: string): Promise<DocumentTable[]> {
    return this.documentTableModel.find({ users_permissions_user: userId }).sort({ createdAt: -1 }).exec();
  }
}
