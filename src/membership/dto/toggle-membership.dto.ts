import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleMembershipDto {
  @IsNotEmpty()
  @IsBoolean()
  enable: boolean;
}
