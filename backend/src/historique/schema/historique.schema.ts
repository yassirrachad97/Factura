import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schema/user.schema'; // Importer le schéma User
import { factures } from '../../factures/schema/facture.schema'; // Importer le schéma Facture

@Schema({ timestamps: true })
export class Historique extends Document {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true }) 
  user: User;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Facture' }])
  factures: factures[];
}

export const HistoriqueSchema = SchemaFactory.createForClass(Historique);