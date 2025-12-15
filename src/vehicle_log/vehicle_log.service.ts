import {BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateVehicleLogDto } from './dto/create-vehicle_log.dto';
import { UpdateVehicleLogDto } from './dto/update-vehicle_log.dto';
import { UpdateBusinessIdDto } from './dto/update-business-id.dto';
import { VehicleLogModel } from 'src/app/schemas/vehicle_log.schema';
import { VehicleModel } from 'src/app/schemas/vehicle.schema';
import { MembershipService } from '../membership/membership.service';
import * as moment from 'moment';

@Injectable()
export class VehicleLogService {
  constructor(
    @InjectModel(VehicleLogModel.name) private vehicleLogModel: Model<VehicleLogModel>,
    @InjectModel(VehicleModel.name) private vehicleModel: Model<VehicleModel>,
    private readonly membershipService: MembershipService,
  ) {}

  async create(createVehicleLogDto: CreateVehicleLogDto, businessId: string) {
    // Find the vehicle by plate number and business ID
    console.log({createVehicleLogDto, businessId});
    
    let vehicle = await this.vehicleModel.findOne({
      plateNumber: createVehicleLogDto.plateNumber.toUpperCase(),
      businessId,
    });
    
    if (!vehicle) {
      vehicle = await this.vehicleModel.create({
        plateNumber: createVehicleLogDto.plateNumber.toUpperCase(),
        vehicleType: createVehicleLogDto.vehicleType,
        businessId,
      });
    }

    if(vehicle.inParking) throw new BadRequestException('Vehicle is already in parking');

    // Check if vehicle has active membership
    const activeMembership = await this.membershipService.findActiveMembership(vehicle.plateNumber.toUpperCase(), businessId);

    
    if (activeMembership) {
      // Vehicle has active membership - no charge
      vehicle.lastLog = new Date();
      vehicle.inParking = true;
      
      await vehicle.save();
      const vehicleLog = await this.vehicleLogModel.create({
        vehicleId: vehicle._id,
        entryTime: new Date(),
        businessId,
        hasMembership: true,
        membershipId: activeMembership._id,
      });

      return {
        ...vehicleLog.toObject(), 
        vehicleType: createVehicleLogDto.vehicleType,
        message: 'Vehicle has active membership - no charge applied'
      };
    }

    // No active membership - proceed with normal entry
    vehicle.lastLog = new Date();
    vehicle.inParking = true;
    
    await vehicle.save();
    const vehicleLog = await this.vehicleLogModel.create({
      vehicleId: vehicle._id,
      entryTime: new Date(),
      businessId,
      hasMembership: false,
    });

    return {...vehicleLog.toObject(), vehicleType: vehicle.vehicleType};
  }

  async findAll(businessId: string) {
    const vehicleLogs = await this.vehicleLogModel
      .find({ businessId, deleted: { $ne: true } })
      .populate({path: 'vehicleId', select: 'plateNumber vehicleType'})
      .exec();
    
    return vehicleLogs.map(log => ({
      ...log.toObject(),
      message: log.hasMembership 
        ? 'Vehicle has active membership - no charge applied'
        : 'Vehicle charged based on parking duration'
    }));
  }

  async findOne(id: string, businessId: string) {
    const vehicleLog = await this.vehicleLogModel
      .findOne({ _id: id, businessId, deleted: { $ne: true } })
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
        { _id: id, businessId, deleted: { $ne: true } },
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

  async removeById(id: string) {
    const vehicleLog = await this.vehicleLogModel
      .findByIdAndUpdate(
        id,
        { 
          deleted: true,
          deletedAt: new Date()
        },
        { new: true }
      )
      .exec();

    if (!vehicleLog) {
      throw new NotFoundException('Vehicle log not found');
    }

    return vehicleLog;
  }

  async getLastVehicleLog(plateNumber: string, businessId: string) {
    const vehicle = await this.vehicleModel
      .findOne({ plateNumber, businessId: new mongoose.Types.ObjectId(businessId), inParking: true })
      .sort({ lastLog: -1 })
      .exec();
    
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const vehicleLog = await this.vehicleLogModel
      .findOne({ vehicleId: vehicle._id, businessId, deleted: { $ne: true } })
      .sort({ entryTime: -1 })
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

    const responseMessage = vehicleLog.hasMembership 
      ? 'Vehicle has active membership - no charge will be applied'
      : 'Vehicle will be charged based on parking duration';

    return {
      ...vehicleLog.toObject(), 
      vehicleType: vehicle.vehicleType,
      userName: vehicle.userName,
      phone: vehicle.phone,
      inParking: vehicle.inParking,
      lastLog: vehicle.lastLog,
      message: responseMessage
    };
  }

  async checkout(plateNumber: string, updateVehicleLogDto: UpdateVehicleLogDto, businessId: string) {
    const vehicle = await this.vehicleModel.findOne({ plateNumber, businessId, inParking: true }).sort({ lastLog: -1 }).exec();

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    
    const vehicleLog = await this.vehicleLogModel
    .findOne({ vehicleId: vehicle._id, businessId, exitTime: null, deleted: { $ne: true } })
    .sort({ entryTime: -1 })
    .exec();
    
    if (!vehicleLog) {
      vehicle.inParking = false;
      await vehicle.save();
      throw new NotFoundException('No active vehicle log found');
    }

    console.log({vehicleLog});

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
    // Check if vehicle has active membership to avoid charging
    if (vehicleLog.hasMembership) {
      // Vehicle has membership - no cost
      vehicleLog.cost = 0;
    } else {
      // No membership - apply the cost from DTO
      vehicleLog.cost = updateVehicleLogDto.cost;
    }

    const savedVehicleLog = await vehicleLog.save();    
    const responseMessage = vehicleLog.hasMembership 
      ? 'Vehicle has active membership - no charge applied'
      : `Vehicle charged: $${vehicleLog.cost}`;
    
    return {
      ...savedVehicleLog.toObject(), 
      vehicleType: vehicle.vehicleType,
      message: responseMessage
    };
  }

  async getVehicleLogs(plateNumber: string, businessId: string) {
    const vehicle = await this.vehicleModel.findOne({ plateNumber, businessId });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return this.vehicleLogModel
      .find({ vehicleId: vehicle._id, businessId, deleted: { $ne: true } })
      .sort({ entryTime: -1 })
      .exec();
  }

  async getVehicleLogsById(vehicleId: string) {
    // Validate vehicle exists
    const vehicle = await this.vehicleModel.findOne({ _id: vehicleId });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    
    return this.vehicleLogModel
      .find({ vehicleId: new mongoose.Types.ObjectId(vehicleId), deleted: { $ne: true } })
      .populate({path: 'vehicleId', select: 'plateNumber vehicleType'})
      .sort({ entryTime: -1 })
      .limit(50)
      .exec();
  }

  async getActiveVehicles(businessId: string) {
    const activeVehicles = await this.vehicleLogModel
      .find({ businessId, exitTime: null, deleted: { $ne: true } })
      .populate({path: 'vehicleId', select: 'plateNumber vehicleType'})
      .sort({ entryTime: -1 })
      .exec();
    
    return activeVehicles.map(log => ({
      ...log.toObject(),
      message: log.hasMembership 
        ? 'Vehicle has active membership - no charge will be applied'
        : 'Vehicle will be charged based on parking duration'
    }));
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
    
    const logsByDate = await this.vehicleLogModel
      .find({
        businessId,
        exitTime: {
          $gte: startDate,
          $lte: endDate
        },
        deleted: { $ne: true }
      })
      .populate({path: 'vehicleId', select: 'plateNumber vehicleType'})
      .sort({ entryTime: -1 })
      .exec();
    
    return logsByDate.map(log => ({
      ...log.toObject(),
      message: log.hasMembership 
        ? 'Vehicle had active membership - no charge applied'
        : `Vehicle charged: $${log.cost}`
    }));
  }

  async filterLogsByDateRange(dateStart: string, dateEnd: string, businessId: string) {
    const startMoment = moment(dateStart).utc().startOf('day');
    const startDate = startMoment.add(5, 'hours').toDate();
    
    const endMoment = moment(dateEnd).utc().endOf('day');
    const endDate = endMoment.add(5, 'hours').toDate();
    
    const logsByDateRange = await this.vehicleLogModel
      .find({
        businessId,
        exitTime: {
          $gte: startDate,
          $lte: endDate
        },
        deleted: { $ne: true }
      })
      .populate({path: 'vehicleId', select: 'plateNumber vehicleType'})
      .sort({ entryTime: -1 })
      .exec();
    
    return logsByDateRange.map(log => ({
      ...log.toObject(),
      message: log.hasMembership 
        ? 'Vehicle had active membership - no charge applied'
        : `Vehicle charged: $${log.cost}`
    }));
  }

  async updateBusinessId(updateBusinessIdDto: UpdateBusinessIdDto) {
    const { from, to } = updateBusinessIdDto;
    console.log({from, to});

    // Validate that both business IDs are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(from) || !mongoose.Types.ObjectId.isValid(to)) {
      throw new BadRequestException('Invalid business ID format');
    }

    

    // Update all vehicles with the old business ID
    const vehicleUpdateResult = await this.vehicleModel.updateMany(
      { businessId: from },
      { businessId: to } 
    );

    // Update all vehicle logs with the old business ID
    const vehicleLogUpdateResult = await this.vehicleLogModel.updateMany(
      { businessId: from },
      { businessId: to } 
    );

    return {
      message: 'Business ID updated successfully',
      vehiclesUpdated: vehicleUpdateResult.modifiedCount,
      vehicleLogsUpdated: vehicleLogUpdateResult.modifiedCount,
      from,
      to
    };
  }
}
