import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VehicleType } from '../../app/schemas/vehicle.schema';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  plateNumber: string;

  @IsNotEmpty()
  @IsEnum(VehicleType)
  vehicleType: VehicleType;
}
