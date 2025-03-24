// src/seed/fournisseur.seed.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { fournisseur } from '../fournisseurs/schema/fournisseur.schema';
import { Category } from '../category/schema/category.schema';

@Injectable()
export class FournisseurSeedService {
  constructor(
    @InjectModel(fournisseur.name) private fournisseurModel: Model<fournisseur>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async seed() {
    const count = await this.fournisseurModel.countDocuments();
    if (count > 0) {
      console.log('Fournisseurs already seeded');
      return;
    }

    // Récupérer les catégories par nom
    const oparCategory = await this.categoryModel.findOne({ name: 'Opar Token' });
    const eauCategory = await this.categoryModel.findOne({ name: 'Eau & Élec.' });
    const telephoneCategory = await this.categoryModel.findOne({ name: 'Téléphonie' });

    // Création des fournisseurs
    const fournisseurs = [
      // Fournisseurs Opar
      { 
        name: 'Cih Voyage !', 
        logo: '/images/services/cih.png', 
        description: 'Paiement de factures CIHVoyage',
        category: oparCategory._id
      },
      { 
        name: 'Markoub.ma', 
        logo: '/images/services/markoub.png', 
        description: 'Paiement ticket d\'autocar',
        category: oparCategory._id
      },
      // ... autres fournisseurs Opar

      // Fournisseurs Eau & Électricité
      { 
        name: 'ONEE', 
        logo: '/images/services/onee.png', 
        description: 'Office National Electricité',
        category: eauCategory._id
      },
      { 
        name: 'Redal', 
        logo: '/images/services/redal.png', 
        description: 'Eau et électricité Rabat',
        category: eauCategory._id
      },

      // Fournisseurs Téléphonie
      { 
        name: 'Maroc Telecom', 
        logo: '/images/services/iam.png', 
        description: 'Factures et recharges',
        category: telephoneCategory._id
      },
      { 
        name: 'Orange', 
        logo: '/images/services/orange.png', 
        description: 'Factures et recharges',
        category: telephoneCategory._id
      },
      { 
        name: 'Inwi', 
        logo: '/images/services/inwi.png', 
        description: 'Factures et recharges',
        category: telephoneCategory._id
      },
    ];

    await this.fournisseurModel.insertMany(fournisseurs);
    console.log('Fournisseurs seeded successfully');
  }
}