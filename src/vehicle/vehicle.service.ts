import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleModel } from '../app/schemas/vehicle.schema';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(VehicleModel.name) private vehicleModel: Model<VehicleModel>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto, businessId: string) {
    const existingVehicle = await this.vehicleModel.findOne({ plateNumber: createVehicleDto.plateNumber.toUpperCase(), businessId});
    if(existingVehicle) return existingVehicle;

    const vehicle = new this.vehicleModel({
      ...createVehicleDto,
      plateNumber: createVehicleDto.plateNumber.toUpperCase(),
      businessId,
    });
    return vehicle.save();
  }

  async findAll(businessId: string) {
    return this.vehicleModel.find({businessId}).exec();
  }

  async findOne(id: string, businessId: string) {
    return this.vehicleModel.findOne({_id: id, businessId}).exec();
  }

  async findByUserId(userId: string) {
    return this.vehicleModel.find({ userId }).exec();
  }

  async findActiveVehicles(businessId: string) {
    return this.vehicleModel.find({ businessId, parking: true }).exec();
  }

  async findByPlateNumber(plateNumber: string, businessId: string) {
    return this.vehicleModel.findOne({ plateNumber, businessId }).exec();
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleModel.findByIdAndUpdate(id, updateVehicleDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.vehicleModel.findByIdAndDelete(id).exec();
  }

  async removeAllByBusiness(businessId: string) {
    return this.vehicleModel.deleteMany({ businessId }).exec();
  }
}
