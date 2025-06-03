import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VehicleLogService } from './vehicle_log.service';
import { CreateVehicleLogDto } from './dto/create-vehicle_log.dto';
import { UpdateVehicleLogDto } from './dto/update-vehicle_log.dto';

@Controller('vehicle-log')
export class VehicleLogController {
  constructor(private readonly vehicleLogService: VehicleLogService) {}

  @Post()
  create(@Body() createVehicleLogDto: CreateVehicleLogDto) {
    return this.vehicleLogService.create(createVehicleLogDto);
  }

  @Get()
  findAll() {
    return this.vehicleLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleLogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleLogDto: UpdateVehicleLogDto) {
    return this.vehicleLogService.update(+id, updateVehicleLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleLogService.remove(+id);
  }
}
