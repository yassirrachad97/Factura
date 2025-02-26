import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
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

  @Prop({ type: [String], default: [] })
  devices: string[];

  @Prop({ enum: UserRole, default: UserRole.USER })  
  role: UserRole;  
}

export const UserSchema = SchemaFactory.createForClass(User);
