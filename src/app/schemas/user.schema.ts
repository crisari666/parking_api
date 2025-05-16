import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

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
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

export { UserModel }
