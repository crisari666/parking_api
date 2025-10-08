import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class UpdateBusinessIdDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  from: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  to: string;
}
