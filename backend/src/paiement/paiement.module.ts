import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaiementService } from './paiement.service';
import { PaiementController } from './paiement.controller';
import { Payment, PaymentSchema } from './schema/paiement.schema'; 
import { factures, InvoiceSchema } from '../factures/schema/facture-schema'; 
import { User, UserSchema } from '../users/schema/user.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema }, 
      { name: factures.name, schema: InvoiceSchema },   
      { name: User.name, schema: UserSchema },        
    ]),
  ],
  providers: [PaiementService],
  controllers: [PaiementController],
})
export class PaiementModule {}
