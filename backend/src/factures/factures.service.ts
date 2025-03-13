import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { factures } from './schema/facture.schema';
import { User } from '../users/schema/user.schema';
import { fournisseur } from '../fournisseurs/schema/fournisseur.schema';
import { CreateFactureDTO } from './DTO/create-facture.dto';

@Injectable()
export class FacturesService {
  constructor(
    @InjectModel(factures.name) private FactureModel: Model<factures>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(fournisseur.name) private FournisseurModel: Model<fournisseur>,
  ) {}

 
async generateInvoice(userId: string, createFactureDTO: CreateFactureDTO) {
  console.log('Generating invoice for user:', userId);
  const { fournisseurId, amount, dueDate } = createFactureDTO;

  if (!fournisseurId) {
    throw new NotFoundException('Provider ID is required');
  }

  const provider = await this.FournisseurModel.findById(fournisseurId).exec();
  if (!provider) {
    console.error('Provider not found:', fournisseurId);
    throw new NotFoundException(`Provider with ID ${fournisseurId} not found`);
  }

  const contractNumber = `CONTRACT-${Date.now()}`;
  console.log('Generated contract number:', contractNumber);
  const invoice = new this.FactureModel({
    userId,
    fournisseurId,
    amount,
    dueDate: new Date(dueDate),
    contractNumber,
    isPaid: false,
    createdBy: userId,
  });
  console.log('Saving invoice:', invoice);
  return invoice.save();
}

  

  
  async getUserInvoices(userId: string): Promise<factures[]> {
    return this.FactureModel.find({ userId })
      .populate('fournisseurId', 'name')
      .exec();
  }
  
  async getInvoiceById(id: string): Promise<factures> {
    const invoice = await this.FactureModel.findById(id)
      .populate('userId', 'firstName lastName email phone')
      .populate('fournisseurId', 'name email')
      .exec();
      
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    
    return invoice;
  }
  
  async markInvoiceAsPaid(id: string): Promise<factures> {
    const invoice = await this.FactureModel.findById(id).exec();
    
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    
    invoice.isPaid = true;
    return invoice.save();
  }
}