import { IsEnum, IsString, IsNotEmpty } from "class-validator";
import { VehicleType } from "src/app/schemas/vehicle.schema";
import { Transform } from "class-transformer";

export class CreateVehicleLogDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  plateNumber: string;

  @IsNotEmpty()
  @IsEnum(VehicleType)
  vehicleType: VehicleType;
}
