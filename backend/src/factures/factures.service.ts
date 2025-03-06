import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { factures } from './schema/facture.schema';
import { User } from '../users/schema/user.schema';
import { fournisseur } from '../fournisseurs/schema/fournisseur.schema';
import { CreateFactureDTO} from './DTO/create-facture.dto';

@Injectable()
export class FacturesService {
  constructor(
    @InjectModel(factures.name) private FactureModel: Model<factures>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(fournisseur.name) private FournisseurModel: Model<fournisseur>,
  ) {}

  async generateInvoice(userId: string, createFactureDTO: CreateFactureDTO): Promise<factures> {
    const { fournisseurId, amount, dueDate } = createFactureDTO;

   
    const provider = await this.FournisseurModel.findById(fournisseurId).exec();
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

   
    const contractNumber = `CONTRACT-${Date.now()}`;

    const invoice = new this.FactureModel({
      userId,
      fournisseurId,
      amount,
      dueDate: new Date(dueDate),
      contractNumber,
    });

    return invoice.save();
  }
}