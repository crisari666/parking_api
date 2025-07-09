import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from 'src/app/schemas/user.schema';
import { PasswordUtil } from 'src/app/utils/passord.util';
import { LoginDto } from './dto/login.dto';
import * as fs from 'fs'
import { join } from 'path';
import * as jwt from 'jsonwebtoken';
import { BusinessModel } from 'src/app/schemas/business.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
    @InjectModel(BusinessModel.name) private businessModel: Model<BusinessModel>,
    private readonly passwordUtil: PasswordUtil,
  ) {}


  async createJWT({userId, role, business}: {userId: string, role: string, business: string}): Promise<string> {
    try {
      const privateKey = fs.readFileSync(join(process.cwd(), 'keys/qp_api.pem'), 'utf8');
      const token = jwt.sign(
        {uuid: userId, role, business}, 
        privateKey, 
        {
          algorithm: 'RS256',
          expiresIn: '7d',
          keyid: '1'
        }, 
      )
      return token
    } catch (error) {
      throw new Error(`Error with the signUpUser method auth.service: ${error.message}`);
    }
  }

  async validateUser(loginDto: LoginDto) {
    // console.log({loginDto});
    
    const user = await this.userModel.findOne({ $or: [{ email: loginDto.user }, { user: loginDto.user }] });
  
    console.log({user});
    
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
      business: user.business,
      lastName: user.lastName,
      token: await this.createJWT({
        userId: user._id.toString(), 
        role: user.role, 
        business: user.business?.toString() ?? ""})
    };
  }
}
