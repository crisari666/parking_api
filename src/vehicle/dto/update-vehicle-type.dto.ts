import { IsEnum, IsNotEmpty } from 'class-validator';
import { VehicleType } from '../../app/schemas/vehicle.schema';

export class UpdateVehicleTypeDto {
  @IsNotEmpty()
  @IsEnum(VehicleType)
  vehicleType: VehicleType;
}
