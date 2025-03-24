import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schema/user.schema';
import { factures } from '../../factures/schema/facture.schema';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: String, ref: 'User', required: true })
  userId: string;

  @Prop({ type: String, ref: 'factures', required: true })
  invoiceId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: Date.now })
  paymentDate: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);