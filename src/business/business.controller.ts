import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, NotFoundException } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { UserHeader } from 'src/app/types/user-header.type';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  create(@Body() createBusinessDto: CreateBusinessDto, @Headers('user') user: UserHeader) {
    console.log({user});
    
    if (!user) {
      throw new NotFoundException('User is required');
    }
    return this.businessService.create(createBusinessDto, user.uuid);
  }

  @Get()
  async userBusiness(@Headers('user') user: UserHeader) {
    if (!user) {
      throw new NotFoundException('User is required');
    }
    const business = await this.businessService.findByUserId(user.uuid);
    return [business];
  }
  
  @Get('all')
  getAllBusinesses() {
    return this.businessService.findAll();
  }

  @Get('my-businesses')
  findMyBusinesses(@Headers('user') user: UserHeader) {
    if (!user) {
      throw new NotFoundException('User is required');
    }
    return this.businessService.findByUserId(user.uuid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto, @Headers('user') user: UserHeader) {
    return this.businessService.update(id, updateBusinessDto, user.uuid);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessService.remove(id);
  }

  @Patch(':id/set-user')
  setUserToBusiness(@Param('id') id: string, @Headers('user') user: UserHeader) {
    if (!user) {
      throw new NotFoundException('User is required');
    }
    return this.businessService.setUserToBusiness(id, user.uuid);
  }
}
