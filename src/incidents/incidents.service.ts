import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident, IncidentDocument } from './schemas/incident.schema';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

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
export class IncidentsService {
  constructor(
    @InjectModel(Incident.name)
    private incidentModel: Model<IncidentDocument>,
  ) {}

  async create(createIncidentDto: CreateIncidentDto): Promise<Incident> {
    const incident = new this.incidentModel(createIncidentDto);
    return incident.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Incident>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.incidentModel
        .find()
        .populate('tenant')
        .populate('site')
        .populate('reportedBy')
        .populate('assignedTo')
        .sort({ incidentTime: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.incidentModel.countDocuments(),
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

  async findOne(id: string): Promise<Incident> {
    const incident = await this.incidentModel
      .findById(id)
      .populate('tenant')
      .populate('site')
      .populate('reportedBy')
      .populate('assignedTo')
      .exec();
    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
    return incident;
  }

  async update(id: string, updateIncidentDto: UpdateIncidentDto): Promise<Incident> {
    const existingIncident = await this.incidentModel
      .findByIdAndUpdate(id, updateIncidentDto, { new: true })
      .exec();
    if (!existingIncident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
    return existingIncident;
  }

  async remove(id: string): Promise<void> {
    const result = await this.incidentModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
  }

  async findBySite(siteId: string, startDate?: Date, endDate?: Date): Promise<Incident[]> {
    const query: any = { site: siteId };
    if (startDate || endDate) {
      query.incidentTime = {};
      if (startDate) query.incidentTime.$gte = startDate;
      if (endDate) query.incidentTime.$lte = endDate;
    }
    return this.incidentModel
      .find(query)
      .populate('reportedBy')
      .populate('assignedTo')
      .sort({ incidentTime: -1 })
      .exec();
  }

  async findByStatus(status: string): Promise<Incident[]> {
    return this.incidentModel
      .find({ incidentStatus: status })
      .populate('tenant')
      .populate('site')
      .populate('reportedBy')
      .populate('assignedTo')
      .sort({ incidentTime: -1 })
      .exec();
  }

  async findBySeverity(severity: string): Promise<Incident[]> {
    return this.incidentModel
      .find({ severity })
      .populate('site')
      .populate('reportedBy')
      .populate('assignedTo')
      .sort({ incidentTime: -1 })
      .exec();
  }

  async findByTenant(tenantId: string, page: number = 1, limit: number = 10): Promise<PaginationResult<Incident>> {
    const skip = (page - 1) * limit;
    const query = { tenant: tenantId };
    const [data, total] = await Promise.all([
      this.incidentModel
        .find(query)
        .populate('site')
        .populate('reportedBy')
        .populate('assignedTo')
        .sort({ incidentTime: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.incidentModel.countDocuments(query),
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

  async findByReporter(reporterId: string): Promise<Incident[]> {
    return this.incidentModel
      .find({ reportedBy: reporterId })
      .populate('site')
      .populate('assignedTo')
      .sort({ incidentTime: -1 })
      .exec();
  }

  async findByAssignee(assigneeId: string): Promise<Incident[]> {
    return this.incidentModel
      .find({ assignedTo: assigneeId })
      .populate('site')
      .populate('reportedBy')
      .sort({ incidentTime: -1 })
      .exec();
  }

  async findByIncidentNumber(incidentNumber: string): Promise<Incident> {
    const incident = await this.incidentModel
      .findOne({ incidentNumber })
      .populate('tenant')
      .populate('site')
      .populate('reportedBy')
      .populate('assignedTo')
      .exec();
    if (!incident) {
      throw new NotFoundException(`Incident with number ${incidentNumber} not found`);
    }
    return incident;
  }

  async assignTo(id: string, assigneeId: string): Promise<Incident> {
    const incident = await this.incidentModel.findByIdAndUpdate(
      id,
      { assignedTo: assigneeId, incidentStatus: 'INVESTIGATING' },
      { new: true }
    ).exec();
    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
    return incident;
  }

  async resolveIncident(id: string, resolutionData: { resolvedAt?: Date; resolutionNotes?: string }): Promise<Incident> {
    const updateData: any = {
      incidentStatus: 'RESOLVED',
      resolvedAt: resolutionData.resolvedAt || new Date(),
    };
    if (resolutionData.resolutionNotes) {
      updateData.resolutionNotes = resolutionData.resolutionNotes;
    }

    const incident = await this.incidentModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).exec();
    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
    return incident;
  }

  async closeIncident(id: string): Promise<Incident> {
    const incident = await this.incidentModel.findByIdAndUpdate(
      id,
      { incidentStatus: 'CLOSED' },
      { new: true }
    ).exec();
    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
    return incident;
  }

  async updateStatus(id: string, status: string): Promise<Incident> {
    const incident = await this.incidentModel.findByIdAndUpdate(
      id,
      { incidentStatus: status },
      { new: true }
    ).exec();
    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
    return incident;
  }

  async getClientVisibleIncidents(tenantId: string): Promise<Incident[]> {
    return this.incidentModel
      .find({ tenant: tenantId, clientVisible: true })
      .populate('site')
      .populate('reportedBy')
      .sort({ incidentTime: -1 })
      .limit(100)
      .exec();
  }

  async getIncidentStatistics(siteId?: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
    bySeverity: Record<string, number>;
    resolved: number;
    critical: number;
  }> {
    const matchQuery = siteId ? { site: siteId } : {};

    const [total, byStatus, bySeverity, resolved, critical] = await Promise.all([
      this.incidentModel.countDocuments(matchQuery),
      this.incidentModel.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$incidentStatus', count: { $sum: 1 } } },
      ]),
      this.incidentModel.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$severity', count: { $sum: 1 } } },
      ]),
      this.incidentModel.countDocuments({ ...matchQuery, incidentStatus: 'RESOLVED' }),
      this.incidentModel.countDocuments({ ...matchQuery, severity: 'CRITICAL', incidentStatus: { $ne: 'RESOLVED' } }),
    ]);

    const statusMap: Record<string, number> = {};
    byStatus.forEach((item: any) => {
      statusMap[item._id] = item.count;
    });

    const severityMap: Record<string, number> = {};
    bySeverity.forEach((item: any) => {
      severityMap[item._id] = item.count;
    });

    return {
      total,
      byStatus: statusMap,
      bySeverity: severityMap,
      resolved,
      critical,
    };
  }
}
