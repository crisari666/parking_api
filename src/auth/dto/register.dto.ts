import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
} 