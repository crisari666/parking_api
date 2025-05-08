import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';


export type ConfigDocument = HydratedDocument<ConfigModel>;

@Schema({timestamps: true})
class ConfigModel extends Document {
  private readonly name: string = 'configmodel'

  @Prop({index: true, required: true, default: true})
  key: string
  
  @Prop({index: true, required: true})
  value: string
}

export const ConfigSchema = SchemaFactory.createForClass(ConfigModel);

export { ConfigModel }
