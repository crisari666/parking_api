import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export enum VehicleType {
  car = 'car',
  motorcycle = 'motorcycle',
}

export type VehicleDocument = HydratedDocument<VehicleModel>;

@Schema({timestamps: true})
class VehicleModel extends Document {
  @Prop({required: true, index: true})
  plateNumber: string;

  @Prop({required: true, enum: VehicleType})
  vehicleType: VehicleType;

  @Prop({default: false})
  inParking: boolean;

  @Prop({type: Date, default: Date.now})
  lastLog: Date;

  @Prop({required: true, index: true, type: mongoose.Schema.Types.ObjectId, ref: 'BusinessModel'})
  businessId: string;

  @Prop({required: false, default: ''})
  userName: string;

  @Prop({required: false, default: ''})
  phone: string;
}

export const VehicleSchema = SchemaFactory.createForClass(VehicleModel);

export { VehicleModel };
