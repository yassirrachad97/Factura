// src/statistics/statistics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../category/schema/category.schema';
import { fournisseur } from '../fournisseurs/schema/fournisseur.schema';
import { User } from '../users/schema/user.schema';
import { factures } from '../factures/schema/facture.schema';

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
      // Récupération des données
      const categories = await this.categoryModel.find().exec();
      const fournisseurs = await this.fournisseurModel.find().exec();
      const users = await this.userModel.find().exec();
      const factures = await this.factureModel.find().exec();

      // Calcul du revenu total
      const totalRevenue = factures.reduce((sum, facture) => sum + facture.amount, 0);
   
      // Factures payées vs non payées
      const paidFactures = factures.filter(facture => facture.isPaid);
      const unpaidFactures = factures.filter(facture => !facture.isPaid);
   
      // Regrouper les factures par mois pour le graphique d'évolution
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

      // Distribution des fournisseurs par catégorie
      const fournisseursByCategory = {};
      fournisseurs.forEach(fournisseur => {
        if (fournisseur.category) {
          fournisseursByCategory[fournisseur.category] = (fournisseursByCategory[fournisseur.category] || 0) + 1;
        }
      });

      return {
        categories,
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