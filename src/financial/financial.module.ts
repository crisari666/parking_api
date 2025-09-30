import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FinancialService } from './financial.service';
import { FinancialController } from './financial.controller';
import { VehicleLogModel, VehicleLogSchema } from '../app/schemas/vehicle_log.schema';
import { MembershipModel, MembershipSchema } from '../app/schemas/membership.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VehicleLogModel.name, schema: VehicleLogSchema },
      { name: MembershipModel.name, schema: MembershipSchema },
    ]),
  ],
  controllers: [FinancialController],
  providers: [FinancialService],
})
export class FinancialModule {}
