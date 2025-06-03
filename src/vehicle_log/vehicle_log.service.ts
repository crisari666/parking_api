import { Injectable } from '@nestjs/common';
import { CreateVehicleLogDto } from './dto/create-vehicle_log.dto';
import { UpdateVehicleLogDto } from './dto/update-vehicle_log.dto';

@Injectable()
export class VehicleLogService {
  create(createVehicleLogDto: CreateVehicleLogDto) {
    return 'This action adds a new vehicleLog';
  }

  findAll() {
    return `This action returns all vehicleLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicleLog`;
  }

  update(id: number, updateVehicleLogDto: UpdateVehicleLogDto) {
    return `This action updates a #${id} vehicleLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicleLog`;
  }
}
