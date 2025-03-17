// paiement/paiement.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { factures } from '../factures/schema/facture.schema';
import { User } from '../users/schema/user.schema';

@Injectable()
export class PaiementService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectModel(factures.name) private factureModel: Model<factures>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      // apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(factureId: string, userId: string) {
    try {
      // Trouver la facture
      const facture = await this.factureModel.findById(factureId).exec();
      if (!facture) {
        throw new BadRequestException('Facture non trouvée');
      }

      if (facture.isPaid) {
        throw new BadRequestException('Cette facture a déjà été payée');
      }

      // Trouver l'utilisateur
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new BadRequestException('Utilisateur non trouvé');
      }

      // Créer un client Stripe si l'utilisateur n'en a pas déjà un
      if (!user.stripeCustomerId) {
        const customer = await this.stripe.customers.create({
          email: user.email,
          name: `${user.firstname} ${user.lastname}`,
          phone: user.telephone || undefined,
        });

        user.stripeCustomerId = customer.id;
        await user.save();
      }

      // Créer un intent de paiement avec Stripe
      const amount = Math.round(facture.amount * 100); // Convertir en centimes
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency: 'mad', // Dirham marocain
        customer: user.stripeCustomerId,
        metadata: {
          factureId: facture.id,
          contractNumber: facture.contractNumber,
        
          userId: userId,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: facture.amount,
      };
    } catch (error) {
      console.error('Erreur lors de la création du paiement:', error);
      throw new BadRequestException(
        error.message || 'Erreur lors de la création du paiement',
      );
    }
  }

  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        const factureId = paymentIntent.metadata.factureId;
        
        // Mettre à jour la facture comme payée
        const facture = await this.factureModel.findByIdAndUpdate(
          factureId,
          { 
            isPaid: true, 
            paidAt: new Date(),
            paymentIntentId: paymentIntentId
          },
          { new: true }
        ).exec();

        return { success: true, facture };
      }
      
      return { success: false, status: paymentIntent.status };
    } catch (error) {
      console.error('Erreur lors de la confirmation du paiement:', error);
      throw new BadRequestException(
        error.message || 'Erreur lors de la confirmation du paiement',
      );
    }
  }

  async getPaymentStatus(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        status: paymentIntent.status,
        factureId: paymentIntent.metadata.factureId,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du statut du paiement:', error);
      throw new BadRequestException(
        error.message || 'Erreur lors de la récupération du statut du paiement',
      );
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    try {
      const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.confirmPayment(paymentIntent.id);
      }

      return { received: true };
    } catch (error) {
      console.error('Erreur lors du traitement du webhook:', error);
      throw new BadRequestException(
        error.message || 'Erreur lors du traitement du webhook',
      );
    }
  }
}