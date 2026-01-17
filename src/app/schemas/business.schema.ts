import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';



export type BusinessDocument = HydratedDocument<BusinessModel>;


@Schema({timestamps: true})
class BusinessModel extends Document {


  @Prop({default: '', required: false})
  name: string

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', index: true})
  userId: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }], default: [], index: true })
  users: string[];

  @Prop({required: true})
  businessName: string;

  @Prop({required: true})
  businessBrand: string;

  @Prop({required: true, type: Number})
  carHourCost: number;

  @Prop({required: true, type: Number}) 
  motorcycleHourCost: number;

  @Prop({required: true, type: Number})
  carMonthlyCost: number;

  @Prop({required: true, type: Number})
  motorcycleMonthlyCost: number;

  @Prop({required: true, type: Number})
  carDayCost: number;

  @Prop({required: true, type: Number})
  motorcycleDayCost: number;

  @Prop({required: true, type: Number})
  carNightCost: number;

  @Prop({required: true, type: Number})
  motorcycleNightCost: number;

  @Prop({required: true, type: Number})
  studentMotorcycleHourCost: number;

  @Prop({ required: true })
  businessNit: string;

  @Prop({ required: true })
  businessResolution: string;

  @Prop({ required: true })
  address: string;
  
  @Prop({ required: true })
  footer: string;

  @Prop({ required: true })
  schedule: string;
}

export const BusinessSchema = SchemaFactory.createForClass(BusinessModel);

export { BusinessModel }
