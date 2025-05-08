import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from 'src/app/schemas/user.schema';
import { PasswordUtil } from 'src/app/utils/passord.util';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
    private readonly passwordUtil: PasswordUtil,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashedPassword = this.passwordUtil.hashString(loginDto.password);
    
    if (hashedPassword !== user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      lastName: user.lastName
    };
  }
}
