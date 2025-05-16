import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { BusinessModel } from '../app/schemas/business.schema';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(BusinessModel.name)
    private businessModel: Model<BusinessModel>,
  ) {}

  async create(createBusinessDto: CreateBusinessDto, userId: string) {
    const createdBusiness = new this.businessModel({
      ...createBusinessDto,
      userId,
    });
    return createdBusiness.save();
  }

  async findAll() {
    return this.businessModel.find().exec();
  }

  async findOne(id: string) {
    return this.businessModel.findById(id).exec();
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto) {
    return this.businessModel
      .findByIdAndUpdate(id, updateBusinessDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.businessModel.findByIdAndDelete(id).exec();
  }

  async findByUserId(userId: string) {
    return this.businessModel.find({ userId }).exec();
  }
}
