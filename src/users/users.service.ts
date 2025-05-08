import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from 'src/app/schemas/user.schema';
import { Model } from 'mongoose';
import { PasswordUtil } from 'src/app/utils/passord.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
    private readonly passwordUtil: PasswordUtil,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = this.passwordUtil.hashString(createUserDto.password);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
