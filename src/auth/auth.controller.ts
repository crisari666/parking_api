import { Controller, Post, Get, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserHeader } from 'src/app/types/user-header.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.validateUser(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('renew')
  async renew(@Headers('authorization') authorization: string) {
    const token = authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return this.authService.renewToken(token);
  }

  @Get('validate')
  async validateJWT() {
    return { valid: true };
  }

  @Get('me')
  async getMe(@Headers('user') user: UserHeader) {
    return this.authService.getCurrentUser(user.uuid);
  }
}
