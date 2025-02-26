import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class fournisseur extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  icon: string; 
}

export const fournisseurSchema = SchemaFactory.createForClass(fournisseur);