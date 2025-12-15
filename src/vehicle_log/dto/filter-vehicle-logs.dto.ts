import { IsNotEmpty, IsString, IsDateString } from "class-validator";

export class FilterVehicleLogsDto {
  @IsNotEmpty()
  @IsDateString()
  dateStart: string;

  @IsNotEmpty()
  @IsDateString()
  dateEnd: string;

  @IsNotEmpty()
  @IsString()
  businessId: string;
}
