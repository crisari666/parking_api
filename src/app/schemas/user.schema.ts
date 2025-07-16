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

  @Prop({index: true, default:""})
  user: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BusinessModel', index: true })
  business: string;

  @Prop({default: '', required: false})
  name: string

  @Prop({required: true, enum: UserRole, default: UserRole.user, index: true})
  role: UserRole

  @Prop({default: '', required: false})
  lastName: string
  
  @Prop({index: true, required: false, default: null})
  email: string

  @Prop({ required: true })
  password: string

  @Prop({default: true, required: false})
  enabled: boolean
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

export { UserModel }
