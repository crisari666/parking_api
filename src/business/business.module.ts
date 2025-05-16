import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { BusinessModel, BusinessSchema } from '../app/schemas/business.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessModel.name, schema: BusinessSchema },
    ]),
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
