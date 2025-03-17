import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
 
class Device {
  @Prop({ required: true })
 iscourrant: boolean;

  @Prop({ required: true })
  deviceName: string;
}

@Schema({ timestamps: true })
export class User extends Document {
  
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  telephone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  otp?: string;

  @Prop()
  otpExpires?: Date;

  @Prop()
  verificationToken?: string;

  @Prop()
  verificationTokenExpires?: Date;

  @Prop({required: true, default: [] })
  devices: Device[];

  @Prop({ enum: UserRole, default: UserRole.USER })  
  role: UserRole;  

  @Prop()
  stripeCustomerId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
