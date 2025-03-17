// src/statistics/statistics.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { Category, CategorySchema } from '../category/schema/category.schema';
import { fournisseur, fournisseurSchema } from '../fournisseurs/schema/fournisseur.schema';
import { User, UserSchema } from '../users/schema/user.schema';
import { factures, InvoiceSchema } from '../factures/schema/facture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: fournisseur.name, schema: fournisseurSchema },
      { name: User.name, schema: UserSchema },
      { name: factures.name, schema: InvoiceSchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}