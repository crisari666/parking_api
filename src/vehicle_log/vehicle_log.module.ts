import { Module } from '@nestjs/common';
import { VehicleLogService } from './vehicle_log.service';
import { VehicleLogController } from './vehicle_log.controller';

@Module({
  controllers: [VehicleLogController],
  providers: [VehicleLogService],
})
export class VehicleLogModule {}
