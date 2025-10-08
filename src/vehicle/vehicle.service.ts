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
    if(existingVehicle) {
      existingVehicle.vehicleType = createVehicleDto.vehicleType
      existingVehicle.save()
    }

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
    return await this.vehicleModel.find({ businessId, inParking: true });
  }

  async findByPlateNumber(plateNumber: string, businessId: string) {
    return this.vehicleModel.findOne({ plateNumber, businessId }).exec();
  }

  async findAllByPlateNumber(plateNumber: string) {
    return this.vehicleModel.find({ plateNumber }).exec();
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

  async setParkingStatus(plateNumber: string, businessId: string, parking: boolean) {
    console.log(plateNumber, businessId, parking);
    
    const update = await this.vehicleModel.findOneAndUpdate({ plateNumber, businessId },{ inParking: parking },
      { new: true }
    )

    console.log(update);

    return update;
  }

  async findUniqueBusinessIds(): Promise<string[]> {
    const result = await this.vehicleModel.distinct('businessId');
    return result;
  }
}
