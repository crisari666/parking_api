import { IsDate, IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * JSON Example:
 * {
 *   "dateStart": "2024-01-01T00:00:00.000Z",
 *   "dateEnd": "2024-12-31T23:59:59.999Z",
 *   "value": 299.99,
 *   "businessId": "business-123",
 *   "enable": true,
 *   "vehicleId": "vehicle-456"
 * }
 */
export class CreateMembershipDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateStart: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateEnd: Date;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsString()
  businessId: string;

  @IsOptional()
  @IsBoolean()
  enable?: boolean;

  @IsNotEmpty()
  @IsString()
  vehicleId: string;
}
