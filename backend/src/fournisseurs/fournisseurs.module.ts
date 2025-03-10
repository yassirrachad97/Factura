import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { FournisseursController } from './fournisseurs.controller';
import { FournisseursService } from './fournisseurs.service';
import { FileUploadService } from './file-upload.service';
import { fournisseur, fournisseurSchema } from './schema/fournisseur.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: fournisseur.name, schema: fournisseurSchema }]),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './uploads',
      }),
    }),
  ],
  controllers: [FournisseursController],
  providers: [FournisseursService, FileUploadService],
  exports: [MongooseModule]
})
export class FournisseursModule {}
