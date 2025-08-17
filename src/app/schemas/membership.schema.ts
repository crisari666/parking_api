import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type MembershipDocument = HydratedDocument<MembershipModel>;

@Schema({ timestamps: true })
class MembershipModel extends Document {
  @Prop({ required: true, type: Date })
  dateStart: Date;

  @Prop({ required: true, type: Date })
  dateEnd: Date;

  @Prop({ required: true, type: Number })
  value: number;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'BusinessModel', index: true })
  businessId: string;

  @Prop({ default: true, type: Boolean })
  enable: boolean;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'VehicleModel', index: true })
  vehicleId: string;
}

export const MembershipSchema = SchemaFactory.createForClass(MembershipModel);

export { MembershipModel };
