import { Controller, Get, Post, Body, Param, Headers, ForbiddenException, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user.dto';
import { CreateUserByUserDto } from './dto/create-user.dto';
import { UserHeader } from 'src/app/types/user-header.type';
import { UserRole } from 'src/app/schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto, @Headers('user') user: UserHeader) {
    if (!user || user.role !== UserRole.admin) {
      throw new ForbiddenException('Only admin users can create users');
    }
    return this.usersService.create(createUserDto);
  }

  @Post('create-by-user')
  async createByUser(@Body() createUserByUserDto: CreateUserByUserDto, @Headers('user') user: UserHeader) {
    if (!user || user.role !== UserRole.user) {
      throw new ForbiddenException('Only users with user role can create users via this endpoint');
    }
    return this.usersService.createByUser(createUserByUserDto, user);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('business/:businessId')
  async findUsersByBusiness(@Param('businessId') businessId: string) {
    return this.usersService.findUsersByBusiness(businessId);
  }

  @Get('my-business')
  async findUsersByMyBusiness(@Headers('user') user: UserHeader) {
    if (!user || !user.business) {
      throw new ForbiddenException('User must be associated with a business');
    }
    return this.usersService.findUsersByBusiness(user.business);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Headers('user') user: UserHeader) {
    if (!user || user.role !== UserRole.admin) {
      throw new ForbiddenException('Only admin users can update user roles');
    }
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Patch(':id/role')
  async updateUserRole( @Param('id') id: string, @Body() updateUserRoleDto: UpdateUserRoleDto, @Headers('user') user: UserHeader
  ) {
    if (!user || user.role !== UserRole.admin) {
      throw new ForbiddenException('Only admin users can update user roles');
    }
    return this.usersService.updateUser(id, updateUserRoleDto);
  }
}
