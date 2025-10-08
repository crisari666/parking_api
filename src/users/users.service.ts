import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from 'src/app/schemas/user.schema';
import { Model } from 'mongoose';
import { PasswordUtil } from 'src/app/utils/passord.util';
import { UpdateUserDto, UpdateUserStatusDto, UpdateUserByUserDto, UpdateUserBusinessDto } from './dto/update-user.dto';
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

  async findUsersByBusiness(businessId: string) {
    return this.userModel.find({ business: businessId }).select('-password').exec();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-password');
    return updatedUser;
  }

  async updateUserStatus(id: string, updateUserStatusDto: UpdateUserStatusDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id, 
      { enabled: updateUserStatusDto.enabled }, 
      { new: true }
    ).select('-password');
    return updatedUser;
  }

  async createByUser(createUserByUserDto: CreateUserByUserDto, creator: UserHeader) {
    const hashedPassword = this.passwordUtil.hashString(createUserByUserDto.password);
    const newUser = new this.userModel({
      user: createUserByUserDto.email,
      email: createUserByUserDto.email,
      password: hashedPassword,
      business: creator.business,
      role: 'worker',
      name: '',
      lastName: ''
    });
    return (await newUser.save()).toObject({ versionKey: false, transform: (doc, ret) => { delete ret.password; return ret; } });
  }

  async updateUserByUser(id: string, updateUserByUserDto: UpdateUserByUserDto, updater: UserHeader) {
    const userToUpdate = await this.userModel.findById(id);
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }
    
    if (userToUpdate.business.toString() !== updater.business) {
      throw new ForbiddenException('User does not belong to the same business');
    }
    
    if (userToUpdate.role !== 'worker') {
      throw new ForbiddenException('Can only update worker users');
    }
    
    const updateData: any = {};
    
    if (updateUserByUserDto.email) {
      updateData.email = updateUserByUserDto.email.toLowerCase();
      updateData.user = updateUserByUserDto.email.toLowerCase();
    }
    
    if (updateUserByUserDto.password) {
      updateData.password = this.passwordUtil.hashString(updateUserByUserDto.password);
    }
    
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    ).select('-password');
    
    return updatedUser;
  }

  async updateUserBusiness(id: string, updateUserBusinessDto: UpdateUserBusinessDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id, 
      { business: updateUserBusinessDto.business }, 
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    
    return updatedUser;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
