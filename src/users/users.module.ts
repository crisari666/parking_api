import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from '../app/schemas/user.schema';
import { PasswordUtil } from '../app/utils/passord.util';

const nameModelSchemas = MongooseModule.forFeature([
  {
    name: UserModel.name,
    schema: UserSchema,
  },
])

@Module({
  imports: [nameModelSchemas],
  controllers: [UsersController],
  providers: [UsersService, PasswordUtil],
})
export class UsersModule {}
