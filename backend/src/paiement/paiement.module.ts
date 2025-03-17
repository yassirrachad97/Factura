// paiement/paiement.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PaiementService } from './paiement.service';
import { PaiementController } from './paiement.controller';
import { factures, InvoiceSchema } from '../factures/schema/facture.schema';
import { User, UserSchema } from '../users/schema/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: factures.name, schema: InvoiceSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [PaiementService],
  controllers: [PaiementController],
  exports: [PaiementService],
})
export class PaiementModule {}