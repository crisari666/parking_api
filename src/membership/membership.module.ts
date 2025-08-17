import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { MembershipSchema, MembershipModel } from '../app/schemas/membership.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MembershipModel.name, schema: MembershipSchema },
    ]),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
