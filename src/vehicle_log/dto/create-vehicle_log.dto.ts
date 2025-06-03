import { IsEnum, IsString, IsNotEmpty } from "class-validator";
import { VehicleType } from "src/app/schemas/vehicle.schema";

export class CreateVehicleLogDto {
  @IsNotEmpty()
  @IsString()
  plateNumber: string;

  @IsNotEmpty()
  @IsEnum(VehicleType)
  vehicleType: VehicleType;
}
