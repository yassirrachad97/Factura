import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schema/user.schema';
import { fournisseur } from '../../fournisseurs/schema/fournisseur.schema';

@Schema({ timestamps: true })
export class factures extends Document {
  @Prop({ type: String, ref: 'User', required: true })
  userId: string;

  @Prop({ type: String, ref: 'fournisseur', required: true })
  fournisseurId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ required: true, unique: true })
  contractNumber: string;

  @Prop({ default: false })
  isPaid: boolean;
}

export const InvoiceSchema = SchemaFactory.createForClass(factures);