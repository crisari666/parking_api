import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { VehicleLogService } from './vehicle_log.service';
import { CreateVehicleLogDto } from './dto/create-vehicle_log.dto';
import { UpdateVehicleLogDto } from './dto/update-vehicle_log.dto';
import { UserHeader } from 'src/app/types/user-header.type';

@Controller('vehicle-log')
export class VehicleLogController {
  constructor(private readonly vehicleLogService: VehicleLogService) {}

  @Post()
  create(@Body() createVehicleLogDto: CreateVehicleLogDto, @Headers('user') user: UserHeader) {
    const businessId = user.business;
    return this.vehicleLogService.create(createVehicleLogDto, businessId);
  }

  @Get()
  findAll(@Headers('user') user: UserHeader) {
    const businessId = user.business;
    return this.vehicleLogService.findAll(businessId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('user') user: UserHeader) {
    const businessId = user.business;
    return this.vehicleLogService.findOne(id, businessId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVehicleLogDto: UpdateVehicleLogDto,
    @Headers('user') user: UserHeader,
  ) {
    const businessId = user.business;
    return this.vehicleLogService.update(id, updateVehicleLogDto, businessId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('user') user: UserHeader) {
    const businessId = user.business;
    return this.vehicleLogService.remove(id, businessId);
  }

  @Get('vehicle/:plateNumber/last')
  getLastVehicleLog(
    @Param('plateNumber') plateNumber: string,
    @Headers('user') user: UserHeader,
  ) {
    const businessId = user.business;
    return this.vehicleLogService.getLastVehicleLog(plateNumber.toUpperCase(), businessId);
  }
}
