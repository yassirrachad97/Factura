import { Module } from '@nestjs/common';
import { FournisseursService } from './fournisseurs.service';
import { FournisseursController } from './fournisseurs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { fournisseur, fournisseurSchema } from './schema/fournisseur.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: fournisseur.name, schema: fournisseurSchema }])
  ],
  providers: [FournisseursService],
  controllers: [FournisseursController],
  exports: [MongooseModule]
})
export class FournisseursModule {}
