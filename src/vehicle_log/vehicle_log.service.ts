import {BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateVehicleLogDto } from './dto/create-vehicle_log.dto';
import { UpdateVehicleLogDto } from './dto/update-vehicle_log.dto';
import { VehicleLogModel } from 'src/app/schemas/vehicle_log.schema';
import { VehicleModel } from 'src/app/schemas/vehicle.schema';
import * as moment from 'moment';

@Injectable()
export class VehicleLogService {
  constructor(
    @InjectModel(VehicleLogModel.name) private vehicleLogModel: Model<VehicleLogModel>,
    @InjectModel(VehicleModel.name) private vehicleModel: Model<VehicleModel>,
  ) {}

  async create(createVehicleLogDto: CreateVehicleLogDto, businessId: string) {
    // Find the vehicle by plate number and business ID
    console.log({createVehicleLogDto, businessId});
    
    let vehicle = await this.vehicleModel.findOne({
      plateNumber: createVehicleLogDto.plateNumber.toUpperCase(),
      businessId,
    });


    console.log({vehicle});
    
    if (!vehicle) {
      vehicle = await this.vehicleModel.create({
        plateNumber: createVehicleLogDto.plateNumber.toUpperCase(),
        vehicleType: createVehicleLogDto.vehicleType,
        businessId,
      });
    }

    if(vehicle.inParking) throw new BadRequestException('Vehicle is already in parking');

    // Create the vehicle log
    const vehicleLog = new this.vehicleLogModel({
      vehicleId: vehicle._id,
      entryTime: new Date(),
      businessId,
    });

    // Update vehicle's last log time
    vehicle.lastLog = new Date();
    vehicle.inParking = true;
    await vehicle.save();

    return vehicleLog.save();
  }

  async findAll(businessId: string) {
    return this.vehicleLogModel
      .find({ businessId })
      .populate({path: 'vehicleId', select: 'plateNumber vehicleType'})
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

  async getLastVehicleLog(plateNumber: string, businessId: string) {
    const vehicle = await this.vehicleModel.findOne({ plateNumber, businessId: new mongoose.Types.ObjectId(businessId) });    
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

    return {...vehicleLog.toObject(), vehicleType: vehicle.vehicleType};
  }

  async checkout(plateNumber: string, updateVehicleLogDto: UpdateVehicleLogDto, businessId: string) {
    const vehicle = await this.vehicleModel.findOne({ plateNumber, businessId });

    console.log({vehicle});
    

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    
    const vehicleLog = await this.vehicleLogModel
    .findOne({ vehicleId: vehicle._id, businessId, exitTime: null })
    .sort({ entryTime: -1 })
    .exec();
    
    if (!vehicleLog) {
      throw new NotFoundException('No active vehicle log found');
    }

    const exitTime = new Date();

    // Calculate duration in minutes
    const durationInMinutes = Math.floor(
      (exitTime.getTime() - vehicleLog.entryTime.getTime()) / (1000 * 60)
    );

    await this.vehicleModel.updateOne({ _id: vehicle._id }, { $set: { inParking: false } });

    // Update the vehicle log with exit time, duration and cost
    vehicleLog.exitTime = exitTime;
    vehicle.inParking = false;
    vehicleLog.duration = durationInMinutes;
    vehicleLog.cost = updateVehicleLogDto.cost;
    
    return vehicleLog.save();
  }

  async getVehicleLogs(plateNumber: string, businessId: string) {
    const vehicle = await this.vehicleModel.findOne({ plateNumber, businessId });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return this.vehicleLogModel
      .find({ vehicleId: vehicle._id, businessId })
      .sort({ entryTime: -1 })
      .exec();
  }

  async getActiveVehicles(businessId: string) {
    return this.vehicleLogModel
      .find({ businessId, exitTime: null })
      .populate({path: 'vehicleId', select: 'plateNumber vehicleType'})
      .sort({ entryTime: -1 })
      .exec();
  }

  async removeAllByBusinessId(businessId: string) {
    return this.vehicleLogModel.deleteMany({ businessId }).exec();
  }

  async getLogsByDate(date: string, businessId: string) {
    const today = moment(date).utc().startOf('day');
    const startDate = today.add(5, 'hours').toDate();
    const endDate = today.endOf('day').add(5, 'hours').toDate();

    // console.log({date, startDate, endDate, businessId});
    
    console.log({startDate, endDate});
    
    return this.vehicleLogModel
      .find({
        businessId,
        exitTime: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .populate({path: 'vehicleId', select: 'plateNumber vehicleType'})
      .sort({ entryTime: -1 })
      .exec();
  }
}
