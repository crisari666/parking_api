import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from 'src/app/schemas/user.schema';
import { PasswordUtil } from 'src/app/utils/passord.util';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
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

  async registerUser(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ 
      $or: [{ email: registerDto.user }, { user: registerDto.user }] 
    });

    if (existingUser) {
      throw new ConflictException('User already exists with this email');
    }

    // Hash the password
    const hashedPassword = this.passwordUtil.hashString(registerDto.password);

    // Create new user
    const newUser = new this.userModel({
      email: registerDto.user,
      user: registerDto.user, // Set user field to same as email
      password: hashedPassword,
      role: 'user', // Default role
      name: '',
      lastName: '',
      business: null
    });

    const savedUser = await newUser.save();

    // Return same response format as login
    return {
      id: savedUser._id,
      email: savedUser.email,
      role: savedUser.role,
      name: savedUser.name,
      business: savedUser.business,
      lastName: savedUser.lastName,
      token: await this.createJWT({
        userId: savedUser._id.toString(), 
        role: savedUser.role, 
        business: savedUser.business?.toString() ?? ""
      })
    };
  }
}
