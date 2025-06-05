import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleLogDto } from './create-vehicle_log.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateVehicleLogDto extends PartialType(CreateVehicleLogDto) {

  @IsNotEmpty()
  @IsNumber()
  cost: number;
}
