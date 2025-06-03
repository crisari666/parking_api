import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { BusinessModel, BusinessSchema } from '../app/schemas/business.schema';
import { UserModel, UserSchema } from 'src/app/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessModel.name, schema: BusinessSchema },
      { name: UserModel.name, schema: UserSchema },
    ]),
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
