import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleLogDto } from './dto/create-vehicle_log.dto';
import { UpdateVehicleLogDto } from './dto/update-vehicle_log.dto';
import { VehicleLogModel } from 'src/app/schemas/vehicle_log.schema';
import { VehicleModel } from 'src/app/schemas/vehicle.schema';

@Injectable()
export class VehicleLogService {
  constructor(
    @InjectModel(VehicleLogModel.name) private vehicleLogModel: Model<VehicleLogModel>,
    @InjectModel(VehicleModel.name) private vehicleModel: Model<VehicleModel>,
  ) {}

  async create(createVehicleLogDto: CreateVehicleLogDto, businessId: string) {
    // Find the vehicle by plate number and business ID
    const vehicle = await this.vehicleModel.findOne({
      plateNumber: createVehicleLogDto.plateNumber,
      businessId,
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    // Create the vehicle log
    const vehicleLog = new this.vehicleLogModel({
      vehicleId: vehicle._id,
      entryTime: new Date(),
      businessId,
    });

    // Update vehicle's last log time
    vehicle.lastLog = new Date();
    await vehicle.save();

    return vehicleLog.save();
  }

  async findAll(businessId: string) {
    return this.vehicleLogModel
      .find({ businessId })
      .populate('vehicleId')
      .exec();
  }

  async findOne(id: string, businessId: string) {
    const vehicleLog = await this.vehicleLogModel
      .findOne({ _id: id, businessId })
      .populate('vehicleId')
      .exec();

    if (!vehicleLog) {
      throw new NotFoundException('Vehicle log not found');
    }

    return vehicleLog;
  }

  async update(id: string, updateVehicleLogDto: UpdateVehicleLogDto, businessId: string) {
    const vehicleLog = await this.vehicleLogModel
      .findOneAndUpdate(
        { _id: id, businessId },
        updateVehicleLogDto,
        { new: true }
      )
      .populate('vehicleId')
      .exec();

    if (!vehicleLog) {
      throw new NotFoundException('Vehicle log not found');
    }

    return vehicleLog;
  }

  async remove(id: string, businessId: string) {
    const vehicleLog = await this.vehicleLogModel
      .findOneAndDelete({ _id: id, businessId })
      .exec();

    if (!vehicleLog) {
      throw new NotFoundException('Vehicle log not found');
    }

    return vehicleLog;
  }

  async   getLastVehicleLog(plateNumber: string, businessId: string) {
    const vehicle = await this.vehicleModel.findOne({ plateNumber, businessId });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const vehicleLog = await this.vehicleLogModel
      .findOne({ vehicleId: vehicle._id, businessId })
      .sort({ entryTime: -1 })
      //.populate('vehicleId')
      .exec();

    if (!vehicleLog) {
      throw new NotFoundException('No vehicle log found');
    }

    // If the log has no exit time, update the duration
    if (!vehicleLog.exitTime) {
      const currentTime = new Date();
      const durationInMinutes = Math.floor((currentTime.getTime() - vehicleLog.entryTime.getTime()) / (1000 * 60));
      vehicleLog.duration = durationInMinutes;
      await vehicleLog.save();
    }

    return vehicleLog;
  }
}
