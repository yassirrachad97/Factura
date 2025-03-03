import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Historique extends Document {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  date: Date;
}

export const HistoriqueSchema = SchemaFactory.createForClass(Historique);
