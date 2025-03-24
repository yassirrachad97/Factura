import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; // Importer Document depuis mongoose

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  icon: string;

  @Prop()
  description: string;

  @Prop()
  order: number;

  @Prop()
  group: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);