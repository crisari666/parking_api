import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModel, UserSchema } from 'src/app/schemas/user.schema';
import { PasswordUtil } from 'src/app/utils/passord.util';
import { BusinessModel, BusinessSchema } from 'src/app/schemas/business.schema';
import { TokenValidationService } from 'src/app/middlewares/token-validation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema }, 
      { name: BusinessModel.name, schema: BusinessSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordUtil, TokenValidationService],
})
export class AuthModule {}
