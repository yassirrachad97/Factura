// src/seed/category.seed.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../category/schema/category.schema';

@Injectable()
export class CategorySeedService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/[&\s]+/g, '');
  }

  async seed() {
    const count = await this.categoryModel.countDocuments();
    if (count > 0) {
      console.log('Categories already seeded');
      return;
    }

    const categories = [
      // SERVICES ESSENTIELS
      { 
        name: 'Opar Token', 
        slug: 'opar',
        icon: '💎', 
        description: 'Gérez vos tokens', 
        order: 1, 
        group: 'SERVICES ESSENTIELS' 
      },
      { 
        name: 'Eau & Élec.', 
        slug: 'eau',
        icon: '💧', 
        description: 'Eau et Électricité', 
        order: 2, 
        group: 'SERVICES ESSENTIELS' 
      },
      { 
        name: 'Téléphonie', 
        slug: 'telephone',
        icon: '📱', 
        description: 'Téléphonie et Internet', 
        order: 3, 
        group: 'SERVICES ESSENTIELS' 
      },
      { 
        name: 'Impôts', 
        slug: 'impots',
        icon: '📊', 
        description: 'Impôts & Taxes', 
        order: 4, 
        group: 'SERVICES ESSENTIELS' 
      },
      
      // SERVICES FINANCIERS
      { 
        name: 'Transfert', 
        slug: 'transfert',
        icon: '💸', 
        description: 'Transfert d\'argent', 
        order: 5, 
        group: 'SERVICES FINANCIERS' 
      },
      { 
        name: 'Comptes', 
        slug: 'comptes',
        icon: '💳', 
        description: 'Comptes de paiement', 
        order: 6, 
        group: 'SERVICES FINANCIERS' 
      },
      { 
        name: 'Sociétés', 
        slug: 'societes',
        icon: '🏢', 
        description: 'Sociétés de financement', 
        order: 7, 
        group: 'SERVICES FINANCIERS' 
      },
      { 
        name: 'Assurance', 
        slug: 'assurance',
        icon: '🛡️', 
        description: 'Assurance et sécurité sociale', 
        order: 8, 
        group: 'SERVICES FINANCIERS' 
      },
      
      // AUTRES SERVICES
      { 
        name: 'Transport', 
        slug: 'transport',
        icon: '🚌', 
        description: 'Services de transport', 
        order: 9, 
        group: 'AUTRES SERVICES' 
      },
      { 
        name: 'Achat', 
        slug: 'achat',
        icon: '🛒', 
        description: 'Achat Internet', 
        order: 10, 
        group: 'AUTRES SERVICES' 
      },
      { 
        name: 'Services', 
        slug: 'services',
        icon: '🔧', 
        description: 'Services M2T', 
        order: 11, 
        group: 'AUTRES SERVICES' 
      },
    ];

    try {
      await this.categoryModel.insertMany(categories);
      console.log('Categories seeded successfully');
    } catch (error) {
      console.error('Error seeding categories:', error);
    }
  }
}