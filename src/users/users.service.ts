import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from 'src/app/schemas/user.schema';
import { Model } from 'mongoose';
import { PasswordUtil } from 'src/app/utils/passord.util';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserByUserDto } from './dto/create-user.dto';
import { UserHeader } from 'src/app/types/user-header.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
    private readonly passwordUtil: PasswordUtil,
  ) {}

  async create(createUserDto: CreateUserDto) {
  console.log({createUserDto});
  
    const hashedPassword = this.passwordUtil.hashString(createUserDto.password);
    const newUser = new this.userModel({
      ...createUserDto,
      email: createUserDto.user.toLowerCase(),
      password: hashedPassword,
    });
    return newUser.save();
  }

  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-password');
    return updatedUser;
  }

  async createByUser(createUserByUserDto: CreateUserByUserDto, creator: UserHeader) {
    const hashedPassword = this.passwordUtil.hashString(createUserByUserDto.password);
    const newUser = new this.userModel({
      user: createUserByUserDto.email,
      email: createUserByUserDto.email,
      password: hashedPassword,
      business: creator.business,
      role: 'user',
      name: '',
      lastName: ''
    });
    return (await newUser.save()).toObject({ versionKey: false, transform: (doc, ret) => { delete ret.password; return ret; } });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
