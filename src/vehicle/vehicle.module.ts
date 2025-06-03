import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleModel, VehicleSchema } from '../app/schemas/vehicle.schema';
  
@Module({
  imports: [
    MongooseModule.forFeature([{ name: VehicleModel.name, schema: VehicleSchema }])
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
