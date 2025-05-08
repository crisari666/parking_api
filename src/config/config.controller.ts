import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
  createOrUpdate(@Body() createConfigDto: CreateConfigDto) {
    return this.configService.createOrUpdate(createConfigDto);
  }

  @Get()
  findAll() {
    return this.configService.findAll();
  }

  @Get(':key')
  findByKey(@Param('key') key: string) {
    return this.configService.findByKey(key);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.configService.remove(key);
  }
}
