import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { ToggleMembershipDto } from './dto/toggle-membership.dto';
import { UserHeader } from 'src/app/types/user-header.type';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post()
  create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipService.create(createMembershipDto);
  }

  @Get()
  findAll() {
    return this.membershipService.findAll();
  }

  @Get('active')
  findActiveMemberships(@Headers('user') user: UserHeader) {
    const businessId = user.business;
    return this.membershipService.findActiveMembershipsByBusiness(businessId);
  }

  @Get('vehicle/:vehicleId/business/:businessId')
  findByVehicleAndBusiness(
    @Param('vehicleId') vehicleId: string,
    @Param('businessId') businessId: string,
  ) {
    return this.membershipService.findByVehicleAndBusiness(vehicleId, businessId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipService.findOne(id);
  }

  @Patch(':id/toggle')
  toggleEnable(
    @Param('id') id: string,
    @Body() toggleMembershipDto: ToggleMembershipDto,
  ) {
    return this.membershipService.toggleEnable(id, toggleMembershipDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembershipDto: UpdateMembershipDto) {
    return this.membershipService.update(id, updateMembershipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipService.remove(id);
  }
}
