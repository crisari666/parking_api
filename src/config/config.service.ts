import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateConfigDto } from './dto/create-config.dto';
import { ConfigModel } from '../app/schemas/config.schema';

@Injectable()
export class ConfigService {
  constructor(
    @InjectModel(ConfigModel.name) private configModel: Model<ConfigModel>,
  ) {}

  async createOrUpdate(createConfigDto: CreateConfigDto) {
    const { key, value } = createConfigDto;
    
    // Try to find existing config
    const existingConfig = await this.configModel.findOne({ key });
    
    if (existingConfig) {
      // Update existing config
      existingConfig.value = value;
      return existingConfig.save();
    } else {
      // Create new config
      const newConfig = new this.configModel({
        key,
        value,
      });
      return newConfig.save();
    }
  }

  async findAll() {
    return this.configModel.find().exec();
  }

  async findByKey(key: string) {
    return this.configModel.findOne({ key }).exec();
  }

  async remove(key: string) {
    return this.configModel.deleteOne({ key }).exec();
  }
}
