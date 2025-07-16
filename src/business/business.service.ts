import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { BusinessModel } from '../app/schemas/business.schema';
import { UserModel } from 'src/app/schemas/user.schema';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(BusinessModel.name) private businessModel: Model<BusinessModel>,
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
  ) {}

  async create(createBusinessDto: CreateBusinessDto, userId: string) {
    const createdBusiness = new this.businessModel({
      ...createBusinessDto,
      userId,
      businessNit: createBusinessDto.businessNit,
      businessResolution: createBusinessDto.businessResolution,
      address: createBusinessDto.address,
      schedule: createBusinessDto.schedule,
    });

    const user = await this.userModel.findById(userId);
    if(!user) throw new NotFoundException('User not found');

    user.business = createdBusiness._id.toString();
    await user.save();

    return createdBusiness.save();
  }

  async findAll() {
    return this.businessModel.find().exec();
  }

  async findOne(id: string) {
    return this.businessModel.findById(id).exec();
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto, userId: string) {

    const user = await this.userModel.findById(userId);
    if(!user) throw new NotFoundException('User not found');

    user.business = id;
    await user.save();

    return await this.businessModel
      .findByIdAndUpdate(
        id,
        {
          ...updateBusinessDto,
          userId: user._id,
          businessNit: updateBusinessDto.businessNit,
          businessResolution: updateBusinessDto.businessResolution,
          address: updateBusinessDto.address,
          schedule: updateBusinessDto.schedule,
        },
        { new: true }
      )
  }

  async remove(id: string) {
    return this.businessModel.findByIdAndDelete(id).exec();
  }

  async findByUserId(userId: string) {
    return this.businessModel.find({ userId }).exec();
  }

  async setUserToBusiness(businessId: string, userId: string) {
    const business = await this.businessModel.findById(businessId);
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the business to include the user
    business.userId = userId;
    await business.save();

    // Update the user to include the business
    user.business = businessId;
    await user.save();

    return business;
  }
}
