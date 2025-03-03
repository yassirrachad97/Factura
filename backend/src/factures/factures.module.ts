import { Module } from '@nestjs/common';
import { FacturesService } from './factures.service';
import { FacturesController } from './factures.controller';
import { factures, InvoiceSchema } from './schema/facture-schema';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FournisseursModule } from 'src/fournisseurs/fournisseurs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: factures.name, schema: InvoiceSchema },   
      { name: User.name, schema: UserSchema },        
    ]),
    FournisseursModule, 

  ],
  providers: [FacturesService],
  controllers: [FacturesController]
})
export class FacturesModule {}
