import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { fournisseur } from './schema/fournisseur.schema';
import { CreatefournisseurDTO} from './DTO/create-fournisseur.dto';
import { UpdatefournisseurDTO} from './DTO/update-fournisseur.dto';

@Injectable()
export class FournisseursService {
  constructor(
    @InjectModel(fournisseur.name) private fournisseurModel: Model<fournisseur>,
  ) {}

  async creer(creerFournisseurDTO: CreatefournisseurDTO): Promise<fournisseur> {
    const nouveauFournisseur = new this.fournisseurModel(creerFournisseurDTO);
    return nouveauFournisseur.save();
  }

  async trouverTous(): Promise<fournisseur[]> {
    return this.fournisseurModel.find().exec();
  }

  async trouverUn(id: string): Promise<fournisseur> {
    const fournisseur = await this.fournisseurModel.findById(id).exec();
    if (!fournisseur) {
      throw new NotFoundException('Fournisseur non trouvé');
    }
    return fournisseur;
  }

  async mettreAJour(
    id: string,
    updatefournisseurDTO: UpdatefournisseurDTO,
  ): Promise<fournisseur> {
    const fournisseurMisAJour = await this.fournisseurModel
      .findByIdAndUpdate(id, updatefournisseurDTO, { new: true })
      .exec();
    if (!fournisseurMisAJour) {
      throw new NotFoundException('Fournisseur non trouvé');
    }
    return fournisseurMisAJour;
  }

  async supprimer(id: string): Promise<void> {
    const result = await this.fournisseurModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Fournisseur non trouvé');
    }
  }
}