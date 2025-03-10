import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { fournisseur } from './schema/fournisseur.schema';
import { CreatefournisseurDTO } from './DTO/create-fournisseur.dto';
import { FileUploadService } from './file-upload.service';

@Injectable()
export class FournisseursService {
  constructor(
    @InjectModel(fournisseur.name) private readonly fournisseurModel: Model<fournisseur>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createFournisseurDto: CreatefournisseurDTO): Promise<fournisseur> {
    const { name, description, categoryId, logo } = createFournisseurDto;

    const existingFournisseur = await this.fournisseurModel.findOne({ name }).exec();
    if (existingFournisseur) {
      throw new BadRequestException('Un fournisseur avec ce nom existe déjà');
    }

    const logoPath = await this.fileUploadService.saveFile(logo);

    const newFournisseur = new this.fournisseurModel({
      name,
      description,
      category: categoryId,
      logo: logoPath,
    });

    return newFournisseur.save();
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

  async update(id: string, updateFournisseurDto: CreatefournisseurDTO): Promise<fournisseur> {
    return this.fournisseurModel
      .findByIdAndUpdate(id, updateFournisseurDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<fournisseur> {
    return this.fournisseurModel.findByIdAndDelete(id).exec();
  }
}