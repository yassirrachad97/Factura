import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FournisseursController } from './fournisseurs.controller';
import { FournisseursService } from './fournisseurs.service';
import { fournisseur, fournisseurSchema } from './schema/fournisseur.schema';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: fournisseur.name, schema: fournisseurSchema }]),
   
  ],
  controllers: [FournisseursController],
  providers: [FournisseursService, S3Service],
  exports: [MongooseModule]
})
export class FournisseursModule {}
