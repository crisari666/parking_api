import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { MembershipSchema, MembershipModel } from '../app/schemas/membership.schema';
import { VehicleModel, VehicleSchema } from 'src/app/schemas/vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MembershipModel.name, schema: MembershipSchema },
      { name: VehicleModel.name, schema: VehicleSchema },
    ]),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
