import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProfile, UserProfileDocument } from './schemas/user-profile.schema';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

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
export class UserProfilesService {
  constructor(
    @InjectModel(UserProfile.name)
    private userProfileModel: Model<UserProfileDocument>,
  ) {}

  async create(createUserProfileDto: CreateUserProfileDto): Promise<UserProfile> {
    const userProfile = new this.userProfileModel(createUserProfileDto);
    return userProfile.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<UserProfile>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.userProfileModel.find().skip(skip).limit(limit).exec(),
      this.userProfileModel.countDocuments(),
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

  async findOne(id: string): Promise<UserProfile> {
    const userProfile = await this.userProfileModel.findById(id).exec();
    if (!userProfile) {
      throw new NotFoundException(`UserProfile with ID ${id} not found`);
    }
    return userProfile;
  }

  async update(id: string, updateUserProfileDto: UpdateUserProfileDto): Promise<UserProfile> {
    const existingUserProfile = await this.userProfileModel
      .findByIdAndUpdate(id, updateUserProfileDto, { new: true })
      .exec();
    if (!existingUserProfile) {
      throw new NotFoundException(`UserProfile with ID ${id} not found`);
    }
    return existingUserProfile;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userProfileModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`UserProfile with ID ${id} not found`);
    }
  }
}
