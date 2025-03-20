import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { factures } from './schema/facture.schema';
import { User } from '../users/schema/user.schema';
import { fournisseur } from '../fournisseurs/schema/fournisseur.schema';
import { CreateFactureDTO } from './dto/create-facture.dto';

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
  const invoicePreview = {
    userId,
    fournisseurId,
    provider, 
    amount,
    dueDate: new Date(dueDate),
    contractNumber,
    isPaid: false,
    createdBy: userId,
    createdAt: new Date(),
    _id: new Types.ObjectId(), 
  };
  console.log('Generated invoice preview:', invoicePreview);
  return invoicePreview;
}
  

async saveInvoiceAfterPayment(invoiceData: any) {
  console.log('Saving invoice after payment:', invoiceData);
  

  const invoice = new this.FactureModel({
    userId: invoiceData.userId,
    fournisseurId: invoiceData.fournisseurId,
    amount: invoiceData.amount,
    dueDate: invoiceData.dueDate,
    contractNumber: invoiceData.contractNumber,
    isPaid: true, 
    createdBy: invoiceData.userId,
  
  });
  
  return invoice.save();
}

  
  async getUserInvoices(userId: string): Promise<factures[]> {
    console.log('Fetching invoices for user:', userId);
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