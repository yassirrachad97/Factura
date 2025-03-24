import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Category } from '../category/schema/category.schema';
import { fournisseur } from '../fournisseurs/schema/fournisseur.schema';
import { User } from '../users/schema/user.schema';
import { factures } from '../factures/schema/facture.schema';
import { Types } from 'mongoose';


type MongooseFacture = Document<unknown, {}, factures> &
  factures &
  Required<{ _id: unknown }> & { __v: number } & {
    createdAt: Date;
    updatedAt: Date;
  };

  @Injectable()
  export class StatisticsService {
    constructor(
      @InjectModel(Category.name) private categoryModel: Model<Category>,
      @InjectModel(fournisseur.name) private fournisseurModel: Model<fournisseur>,
      @InjectModel(User.name) private userModel: Model<User>,
      @InjectModel(factures.name) private factureModel: Model<factures>,
    ) {}
  
    async calculateStatistics() {
      try {
        console.log("Fetching fournisseurs...");
        const fournisseurs = await this.fournisseurModel.find().exec();
        console.log("Fournisseurs fetched:", fournisseurs);
  
        console.log("Fetching users...");
        const users = await this.userModel.find().exec();
        console.log("Users fetched:", users);
  
        console.log("Fetching factures...");
        const factures = (await this.factureModel.find().exec()) as MongooseFacture[];
        console.log("Factures fetched:", factures);
  
   
        const totalRevenue = factures.reduce((sum, facture) => sum + facture.amount, 0);
  
        const paidFactures = factures.filter(facture => facture.isPaid);
        const unpaidFactures = factures.filter(facture => !facture.isPaid);
  
        const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
        const monthlyData = Array(12).fill(0).map((_, i) => ({
          name: monthNames[i],
          revenue: 0,
          count: 0
        }));
  
        factures.forEach(facture => {
          const date = new Date(facture.createdAt || facture.dueDate);
          const month = date.getMonth();
          monthlyData[month].revenue += facture.amount;
          monthlyData[month].count += 1;
        });
  
        const fournisseursByCategory: { [key: string]: number } = {};
        fournisseurs.forEach(fournisseur => {
          if (fournisseur.category) {
            const categoryId = fournisseur.category.toString();
            fournisseursByCategory[categoryId] = (fournisseursByCategory[categoryId] || 0) + 1;
          }
        });
  
       
        return {
          fournisseurs,
          users,
          factures,
          totalRevenue,
          totalFactures: factures.length,
          totalPaidFactures: paidFactures.length,
          totalUnpaidFactures: unpaidFactures.length,
          monthlyRevenue: monthlyData,
          fournisseursByCategory
        };
      } catch (error) {
        console.error("Error calculating statistics:", error);
        throw error;
      }
    }
  }
  