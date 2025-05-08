import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModel, UserSchema } from 'src/app/schemas/user.schema';
import { PasswordUtil } from 'src/app/utils/passord.util';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordUtil],
})
export class AuthModule {}
