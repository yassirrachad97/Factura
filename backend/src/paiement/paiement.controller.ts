import { 
    Controller, 
    Post, 
    Body, 
    Headers, 
    Req, 
    UseGuards, 
    Get, 
    Param, 
    RawBodyRequest,
    BadRequestException
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { PaiementService } from './paiement.service';
  import { Request } from 'express';
  
  @Controller('paiement')
  export class PaiementController {
    constructor(private paiementService: PaiementService) {}
  
    @Post('create-payment-intent')
    @UseGuards(AuthGuard('jwt'))
    async createPaymentIntent(
      @Body('factureId') factureId: string,
      @Req() req,
    ) {
      if (!factureId) {
        throw new BadRequestException('factureId is required');
      }
  
      if (!req.user || !req.user._id) {
        throw new BadRequestException('User not authenticated');
      }
  
      return this.paiementService.createPaymentIntent(factureId, req.user._id);
    }
  
    @Post('confirm-payment')
    @UseGuards(AuthGuard('jwt'))
    async confirmPayment(
      @Body('paymentIntentId') paymentIntentId: string,
    ) {
      if (!paymentIntentId) {
        throw new BadRequestException('paymentIntentId is required');
      }
  
      return this.paiementService.confirmPayment(paymentIntentId);
    }
  
    @Get('payment-status/:paymentIntentId')
    @UseGuards(AuthGuard('jwt'))
    async getPaymentStatus(
      @Param('paymentIntentId') paymentIntentId: string,
    ) {
      if (!paymentIntentId) {
        throw new BadRequestException('paymentIntentId is required');
      }
  
      return this.paiementService.getPaymentStatus(paymentIntentId);
    }
  
    @Post('webhook')
    async handleWebhook(
      @Headers('stripe-signature') signature: string,
      @Req() req: RawBodyRequest<Request>,
    ) {
      if (!signature) {
        throw new BadRequestException('stripe-signature header is required');
      }
  
      if (!req.rawBody) {
        throw new BadRequestException('Request body is required');
      }
  
      return this.paiementService.handleWebhook(signature, req.rawBody);
    }
  }