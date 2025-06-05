import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { UserHeader } from 'src/app/types/user-header.type';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto, @Headers('user') user: UserHeader) {
    const businessId = user.business;
    console.log({user});
    
    return this.vehicleService.create(createVehicleDto, businessId);
  }

  @Get()
  findAll(@Headers('user') user: UserHeader) {
    const businessId = user.business;
    return this.vehicleService.findAll(businessId);
  }

  @Get('my-vehicles')
  findUserVehicles(@Headers('user') user: UserHeader) {
    const userId = user.uuid;
    return this.vehicleService.findByUserId(userId);
  }

  @Get('active')
  findActiveVehicles(@Headers('user') user: UserHeader) {
    const businessId = user.business;
    return this.vehicleService.findActiveVehicles(businessId);
  }

  @Get('plate/:plateNumber')
  findByPlateNumber(@Param('plateNumber') plateNumber: string, @Headers('user') user: UserHeader) {
    const businessId = user.business;
    return this.vehicleService.findByPlateNumber(plateNumber, businessId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('user') user: UserHeader) {
    const businessId = user.business;
    return this.vehicleService.findOne(id, businessId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(id);
  }

  @Delete('business/:businessId')
  removeAllByBusiness(@Param('businessId') businessId: string) {
    return this.vehicleService.removeAllByBusiness(businessId);
  }
}
