import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { ToggleMembershipDto } from './dto/toggle-membership.dto';
import { MembershipModel } from '../app/schemas/membership.schema';

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel(MembershipModel.name)
    private readonly membershipModel: Model<MembershipModel>,
  ) {}

  async create(createMembershipDto: CreateMembershipDto): Promise<MembershipModel> {
    const createdMembership = new this.membershipModel(createMembershipDto);
    return createdMembership.save();
  }

  async findAll(): Promise<MembershipModel[]> {
    return this.membershipModel.find().exec();
  }

  async findOne(id: string): Promise<MembershipModel> {
    const membership = await this.membershipModel.findById(id).exec();
    if (!membership) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }
    return membership;
  }

  async findByVehicleAndBusiness(vehicleId: string, businessId: string): Promise<MembershipModel[]> {
    return this.membershipModel
      .find({ vehicleId, businessId })
      .sort({ dateStart: -1 })
      .exec();
  }

  async toggleEnable(id: string, toggleMembershipDto: ToggleMembershipDto): Promise<MembershipModel> {
    const membership = await this.membershipModel
      .findByIdAndUpdate(
        id,
        { enable: toggleMembershipDto.enable },
        { new: true }
      )
      .exec();
    
    if (!membership) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }
    
    return membership;
  }

  async update(id: string, updateMembershipDto: UpdateMembershipDto): Promise<MembershipModel> {
    const membership = await this.membershipModel
      .findByIdAndUpdate(id, updateMembershipDto, { new: true })
      .exec();
    
    if (!membership) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }
    
    return membership;
  }

  async remove(id: string): Promise<void> {
    const result = await this.membershipModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }
  }
}
