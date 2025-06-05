import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export enum VehicleLogType {
  car = 'car',
  motorcycle = 'motorcycle',
}

export enum PaymentMethod {
  cash = 0,
  transfer = 1,
  credit = 2,
  debit = 3,
  other = 4,
}

export type VehicleLogDocument = HydratedDocument<VehicleLogModel>;

@Schema({timestamps: true})
class VehicleLogModel extends Document {
  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'VehicleModel'})
  vehicleId: string;

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'BusinessModel'})
  businessId: string;

  @Prop({required: true, type: Date})
  entryTime: Date;

  @Prop({type: Date, default: null})
  exitTime: Date;

  @Prop({type: Number, default: 0})
  duration: number;

  @Prop({type: Number, default: 0})
  cost: number;
  
  @Prop({type: Number, default: null})
  paymentMethod: PaymentMethod;
}

export const VehicleLogSchema = SchemaFactory.createForClass(VehicleLogModel);

export { VehicleLogModel }

