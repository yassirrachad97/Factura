// src/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySeedService } from './category.seed';
import { FournisseurSeedService } from './fournisseur.seed';
import { Category, CategorySchema } from '../category/schema/category.schema';
import { fournisseur, fournisseurSchema } from '../fournisseurs/schema/fournisseur.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: fournisseur.name, schema: fournisseurSchema },
    ]),
  ],
  providers: [CategorySeedService, FournisseurSeedService],
  exports: [CategorySeedService, FournisseurSeedService],
})
export class SeedModule {}