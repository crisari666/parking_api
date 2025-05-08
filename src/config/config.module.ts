import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { ConfigModel, ConfigSchema } from '../app/schemas/config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConfigModel.name, schema: ConfigSchema },
    ]),
  ],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModule {}
