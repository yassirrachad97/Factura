import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { fournisseur } from './schema/fournisseur.schema';
import { CreatefournisseurDTO } from './DTO/create-fournisseur.dto';
import { UpdatefournisseurDTO } from './DTO/update-fournisseur.dto';

@Injectable()
export class FournisseursService {
  constructor(
    @InjectModel(fournisseur.name) private readonly fournisseurModel: Model<fournisseur>,
   
  ) {}

  async create(createFournisseurDto: CreatefournisseurDTO): Promise<fournisseur> {
    const { name, description, category, logo } = createFournisseurDto;
  

  
    const existingFournisseur = await this.fournisseurModel.findOne({ name }).exec();
    if (existingFournisseur) {
      throw new BadRequestException('Un fournisseur avec ce nom existe déjà');
    }
  
    const newFournisseur = new this.fournisseurModel({
      name,
      description,
      category,
      logo: logo || null,
    });
  
    const savedFournisseur = await newFournisseur.save();
   
  
    return savedFournisseur;
  }
  
  

  async findAll(): Promise<fournisseur[]> {
    return this.fournisseurModel.find().populate('category').exec();
  }

  async findByCategory(categoryId: string): Promise<fournisseur[]> {
    return this.fournisseurModel
      .find({ category: categoryId })
      .populate('category')
      .exec();
  }

  async findOne(id: string): Promise<fournisseur> {
    return this.fournisseurModel.findById(id).populate('category').exec();
  }

  async update(id: string, updateFournisseurDto: UpdatefournisseurDTO): Promise<fournisseur> {

    return this.fournisseurModel
    .findByIdAndUpdate(id, { $set: updateFournisseurDto }, { new: true })
      .exec();
  }
  

  async delete(id: string): Promise<fournisseur> {
    return this.fournisseurModel.findByIdAndDelete(id).exec();
  }
}