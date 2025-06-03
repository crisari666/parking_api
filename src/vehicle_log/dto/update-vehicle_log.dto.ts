import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleLogDto } from './create-vehicle_log.dto';

export class UpdateVehicleLogDto extends PartialType(CreateVehicleLogDto) {}
