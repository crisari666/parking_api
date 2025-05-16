import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsString()
  @IsNotEmpty()
  businessBrand: string;

  @IsNumber()
  @IsNotEmpty()
  carHourCost: number;

  @IsNumber()
  @IsNotEmpty()
  motorcycleHourCost: number;

  @IsNumber()
  @IsNotEmpty()
  carMonthlyCost: number;

  @IsNumber()
  @IsNotEmpty()
  motorcycleMonthlyCost: number;

  @IsNumber()
  @IsNotEmpty()
  carDayCost: number;

  @IsNumber()
  @IsNotEmpty()
  motorcycleDayCost: number;

  @IsNumber()
  @IsNotEmpty()
  carNightCost: number;

  @IsNumber()
  @IsNotEmpty()
  motorcycleNightCost: number;

  @IsNumber()
  @IsNotEmpty()
  studentMotorcycleHourCost: number;
}
