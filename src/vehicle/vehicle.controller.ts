import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, ForbiddenException } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FindVehiclesDto } from './dto/find-vehicles.dto';
import { UserHeader } from 'src/app/types/user-header.type';
import { UserRole } from 'src/app/schemas/user.schema';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto, @Headers('user') user: UserHeader) {
    const businessId = user.business;
    // console.log({user});
    
    return this.vehicleService.create(createVehicleDto, businessId);
  }

  @Get()
  findAll(@Headers('user') user: UserHeader) {
    const businessId = user.business;
    return this.vehicleService.findAll(businessId);
  }

  @Get('business/:businessId')
  findAllByBusinessId(@Param('businessId') businessId: string) {
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
    return this.vehicleService.findByPlateNumber(plateNumber.toUpperCase(), businessId);
  }

  @Get('plate/:plateNumber/all')
  findAllByPlateNumber(@Param('plateNumber') plateNumber: string) {
    return this.vehicleService.findAllByPlateNumber(plateNumber.toUpperCase());
  }

  @Get('business-ids')
  findUniqueBusinessIds() {
    return this.vehicleService.findUniqueBusinessIds();
  }

  @Post('find')
  findVehicles(@Body() findVehiclesDto: FindVehiclesDto, @Headers('user') user: UserHeader) {
    // Only admin users can search by businessId
    if (findVehiclesDto.business && (!user || user.role !== UserRole.admin)) {
      throw new ForbiddenException('Only admin users can find vehicles by businessId');
    }
    return this.vehicleService.findVehicles(findVehiclesDto);
  }

  @Patch('plate/:plateNumber/parking')
  setParkingStatus(@Param('plateNumber') plateNumber: string, @Body('parking') parking: boolean, @Headers('user') user: UserHeader) {
    const businessId = user.business;
    return this.vehicleService.setParkingStatus(plateNumber.toUpperCase(), businessId, parking);
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
