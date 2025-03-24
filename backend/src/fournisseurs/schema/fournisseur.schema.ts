import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class fournisseur extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  logo: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;
}

export const fournisseurSchema = SchemaFactory.createForClass(fournisseur);