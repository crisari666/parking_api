import { IsNotEmpty, IsString, IsOptional, MinLength } from 'class-validator';

export class FindVehiclesDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  plateNumber: string;

  @IsOptional()
  @IsString()
  business?: string;
}
