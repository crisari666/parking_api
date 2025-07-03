import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export enum UserRole {
  admin = 'admin',
  user = 'user',
  worker = 'worker',
} 

export type UserDocument = HydratedDocument<UserModel>;

@Schema({timestamps: true})
class UserModel extends Document {
  readonly name = 'AccountingModel';

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', index: true })
  user: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BusinessModel', index: true })
  business: string;


  @Prop({ type: Date, index: true })
  date: Date

  @Prop({ type: Number, index: true })
  amount: number

  
  @Prop({ type: Number, index: true })
  totalCars: number
  
  @Prop({ type: Number, index: true })
  totalMotorcycles: number

  @Prop({ type: Number, index: true })
  totalAmount: number
  
  @Prop({ type: Number, index: true })
  totalCash: number
  
  @Prop({ type: Number, index: true })
  totalTransfer: number
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

export { UserModel }
