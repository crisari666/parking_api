import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { VehicleLogModel } from '../app/schemas/vehicle_log.schema';
import { MembershipModel } from '../app/schemas/membership.schema';
import * as moment from 'moment';

@Injectable()
export class FinancialService {
  constructor(
    @InjectModel(VehicleLogModel.name) private vehicleLogModel: Model<VehicleLogModel>,
    @InjectModel(MembershipModel.name) private membershipModel: Model<MembershipModel>,
  ) {}

  // create method can be implemented later if needed

  async getFinancialResumeByDate(date: string, businessId: string) {
    // Use the same date filtering logic as getLogsByDate
    const today = moment(date).utc().startOf('day');
    const startDate = today.add(5, 'hours').toDate();
    const endDate = today.endOf('day').add(5, 'hours').toDate();    
    const [vehicleLogsAggregation, vehicleTypeBreakdown, membershipsAggregation] = await Promise.all([
      // Get vehicle payments aggregation
      this.vehicleLogModel.aggregate([
        {
          $match: {
            businessId: new mongoose.Types.ObjectId(businessId),
            exitTime: {
              $gte: startDate,
              $lte: endDate
            },
            cost: { $gt: 0 }
          }
        },
        {
          $group: {
            _id: null,
            totalPaidByVehicles: { $sum: '$cost' },
            totalVehiclesProcessed: { $sum: 1 },
            averageVehiclePayment: { $avg: '$cost' }
          }
        }
      ]),
      // Get vehicle type breakdown with pipeline lookup
      this.vehicleLogModel.aggregate([
        {
          $match: {
            businessId: new mongoose.Types.ObjectId(businessId),
            exitTime: {
              $gte: startDate,
              $lte: endDate
            },
            cost: { $gt: 0 }
          }
        },
        {
          $lookup: {
            from: 'vehiclemodels',
            let: { vehicleId: '$vehicleId' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: [{$toObjectId: '$$vehicleId'}, '$_id'] }
                }
              },
              {
                $project: {
                  vehicleType: 1,
                  plateNumber: 1,
                  userName: 1,
                  phone: 1,
                  inParking: 1,
                  lastLog: 1
                }
              }
            ],
            as: 'vehicle'
          }
        },
        {
          $unwind: '$vehicle'
        },
        {
          $group: {
            _id: '$vehicle.vehicleType',
            count: { $sum: 1 },
            totalCost: { $sum: '$cost' },
            vehicles: {
              $push: {
                plateNumber: '$vehicle.plateNumber',
                userName: '$vehicle.userName',
                phone: '$vehicle.phone',
                inParking: '$vehicle.inParking',
                lastLog: '$vehicle.lastLog',
                cost: '$cost'
              }
            }
          }
        }
      ]),
      // Get memberships aggregation
      this.membershipModel.aggregate([
        {
          $match: {
            businessId: new mongoose.Types.ObjectId(businessId),
            enable: true,
            createdAt: { $lte: endDate, $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalReceivedByMemberships: { $sum: '$value' },
            totalActiveMemberships: { $sum: 1 },
            averageMembershipValue: { $avg: '$value' }
          }
        }
      ])
    ]);
    
    
    const vehicleData = vehicleLogsAggregation[0] || {
      totalPaidByVehicles: 0,
      totalVehiclesProcessed: 0,
      averageVehiclePayment: 0
    };

    const membershipData = membershipsAggregation[0] || {
      totalReceivedByMemberships: 0,
      totalActiveMemberships: 0,
      averageMembershipValue: 0
    };

    // Process vehicle type breakdown with detailed vehicle information
    const vehicleTypeStats = {
      car: { count: 0, totalCost: 0, vehicles: [] },
      motorcycle: { count: 0, totalCost: 0, vehicles: [] }
    };

    vehicleTypeBreakdown.forEach(item => {
      if (item._id === 'car' || item._id === 'motorcycle') {
        vehicleTypeStats[item._id] = {
          count: item.count,
          totalCost: item.totalCost
        };
      }
    });

    const totalPaidByVehicles = vehicleData.totalPaidByVehicles;
    const totalReceivedByMemberships = membershipData.totalReceivedByMemberships;

    return {
      date: date,
      summary: {
        totalPaidByVehicles,
        totalReceivedByMemberships,
        totalRevenue: totalPaidByVehicles + totalReceivedByMemberships
      },
      statistics: {
        totalVehiclesProcessed: vehicleData.totalVehiclesProcessed,
        totalActiveMemberships: membershipData.totalActiveMemberships,
        averageVehiclePayment: vehicleData.averageVehiclePayment,
        averageMembershipValue: membershipData.averageMembershipValue
      },
      vehicleBreakdown: {
        car: {
          count: vehicleTypeStats.car.count,
          totalCost: vehicleTypeStats.car.totalCost,
        },
        motorcycle: {
          count: vehicleTypeStats.motorcycle.count,
          totalCost: vehicleTypeStats.motorcycle.totalCost,
        }
      }
    };
  }
}
