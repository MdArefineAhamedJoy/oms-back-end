import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site, SiteDocument } from './schemas/site.schema';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

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
export class SitesService {
  constructor(
    @InjectModel(Site.name)
    private siteModel: Model<SiteDocument>,
  ) {}

  async create(createSiteDto: CreateSiteDto): Promise<Site> {
    const site = new this.siteModel(createSiteDto);
    return site.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Site>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.siteModel.find().skip(skip).limit(limit).exec(),
      this.siteModel.countDocuments(),
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

  async findOne(id: string): Promise<Site> {
    const site = await this.siteModel.findById(id).exec();
    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }
    return site;
  }

  async update(id: string, updateSiteDto: UpdateSiteDto): Promise<Site> {
    const existingSite = await this.siteModel
      .findByIdAndUpdate(id, updateSiteDto, { new: true })
      .exec();
    if (!existingSite) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }
    return existingSite;
  }

  async remove(id: string): Promise<void> {
    const result = await this.siteModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }
  }
}
