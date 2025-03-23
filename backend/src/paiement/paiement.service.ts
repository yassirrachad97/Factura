import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
    this.stripe = new Stripe(this.configService.get<string>('stripe.secretKey'), {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createPaymentIntent(factureId: string, userId: string) {
    try {
      // Fetch the invoice
      const facture = await this.factureModel.findById(factureId).exec();
      if (!facture) {
        throw new NotFoundException('Facture non trouvée');
      }

      if (facture.isPaid) {
        throw new BadRequestException('Cette facture a déjà été payée');
      }

      // Find the user
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      // Create a Stripe customer if the user doesn't have one yet
      if (!user.stripeCustomerId) {
        const customer = await this.stripe.customers.create({
          email: user.email,
          name: `${user.firstname} ${user.lastname}`,
          phone: user.telephone || undefined,
        });

        user.stripeCustomerId = customer.id;
        await user.save();
      }

      // Convert amount to cents (Stripe uses the smallest currency unit)
      const amount = Math.round(facture.amount * 100);
      
      // Create a payment intent with Stripe
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency: this.configService.get<string>('stripe.currency', 'mad'),
        customer: user.stripeCustomerId,
        metadata: {
          factureId: facture.id,
          contractNumber: facture.contractNumber,
          userId: userId,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: facture.amount,
        publicKey: this.configService.get<string>('stripe.publicKey'),
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
      
      if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing') {
        const factureId = paymentIntent.metadata.factureId;
        
        // Mark the invoice as paid
        const facture = await this.factureModel.findByIdAndUpdate(
          factureId,
          { 
            isPaid: true, 
            paidAt: new Date(),
            paymentIntentId: paymentIntentId 
          },
          { new: true }
        ).exec();

        if (!facture) {
          throw new NotFoundException(`Facture avec ID ${factureId} non trouvée`);
        }

        return { 
          success: true, 
          status: paymentIntent.status,
          facture 
        };
      }
      
      return { 
        success: false, 
        status: paymentIntent.status 
      };
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
      const webhookSecret = this.configService.get<string>('stripe.webhookSecret');
      if (!webhookSecret) {
        throw new BadRequestException('Webhook secret not configured');
      }

      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );

      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;
        // Add more event types as needed
      }

      return { received: true, type: event.type };
    } catch (error) {
      console.error('Erreur lors du traitement du webhook:', error);
      throw new BadRequestException(
        error.message || 'Erreur lors du traitement du webhook',
      );
    }
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    // Process the successful payment (already handled in confirmPayment)
    await this.confirmPayment(paymentIntent.id);
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const factureId = paymentIntent.metadata.factureId;
    if (factureId) {
      // Update the invoice status to indicate payment failure if needed
      console.log(`Payment failed for invoice ${factureId}`);
    }
  }
}
