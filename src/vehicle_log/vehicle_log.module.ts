import { Module } from '@nestjs/common';
import { VehicleLogService } from './vehicle_log.service';
import { VehicleLogController } from './vehicle_log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleLogSchema, VehicleLogModel } from 'src/app/schemas/vehicle_log.schema';
import { VehicleSchema, VehicleModel } from 'src/app/schemas/vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VehicleLogModel.name, schema: VehicleLogSchema },
      { name: VehicleModel.name, schema: VehicleSchema },
    ])
  ],
  controllers: [VehicleLogController],
  providers: [VehicleLogService],
})
export class VehicleLogModule {}
