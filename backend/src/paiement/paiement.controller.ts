

import { 
    Controller, 
    Post, 
    Body, 
    Headers, 
    Req, 
    UseGuards, 
    Get, 
    Param, 
    RawBodyRequest 
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { PaiementService } from './paiement.service';


  
  @Controller('paiement')
  export class PaiementController {
    constructor(private paiementService: PaiementService) {}
  
    @Post('create-payment-intent')
    @UseGuards(AuthGuard('jwt'))
    async createPaymentIntent(
      @Body('factureId') factureId: string,
      @Req() req,
    ) {
      return this.paiementService.createPaymentIntent(factureId,  req.user._id);
    }
  
    @Post('confirm-payment')
    @UseGuards(AuthGuard('jwt'))
    async confirmPayment(
      @Body('paymentIntentId') paymentIntentId: string,
    ) {
      return this.paiementService.confirmPayment(paymentIntentId);
    }
  
    @Get('payment-status/:paymentIntentId')
    @UseGuards(AuthGuard('jwt'))
    async getPaymentStatus(
      @Param('paymentIntentId') paymentIntentId: string,
    ) {
      return this.paiementService.getPaymentStatus(paymentIntentId);
    }
  
    @Post('webhook')
    async handleWebhook(
      @Headers('stripe-signature') signature: string,
      @Req() req: RawBodyRequest<Request>,
    ) {
      return this.paiementService.handleWebhook(signature, req.rawBody);
    }
  }