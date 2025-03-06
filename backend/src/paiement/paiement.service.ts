import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schema/paiement.schema';
import { factures } from '../factures/schema/facture.schema';
import { User } from '../users/schema/user.schema';

@Injectable()
export class PaiementService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(factures.name) private invoiceModel: Model<factures>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async payInvoice(userId: string, invoiceId: string): Promise<Payment> {
    const invoice = await this.invoiceModel.findById(invoiceId).exec();
    if (!invoice || invoice.userId.toString() !== userId) {
      throw new NotFoundException('Invoice not found');
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Vérifier si l'utilisateur a suffisamment de fonds
    // if (user.balance < invoice.amount) {
    //   throw new BadRequestException('Insufficient funds');
    // }

    // Mettre à jour le solde de l'utilisateur
    // user.balance -= invoice.amount;
    await user.save();

   
    invoice.isPaid = true;
    await invoice.save();

   
    const payment = new this.paymentModel({
      userId,
      invoiceId,
      amount: invoice.amount,
    });

    return payment.save();
  }
}