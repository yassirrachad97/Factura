import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch, UnauthorizedException } from '@nestjs/common';
import { FacturesService } from './factures.service';
import { CreateFactureDTO } from './DTO/create-facture.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('invoices')
export class FacturesController {
  constructor(private readonly FacturesService: FacturesService) {}

  @Post('generate')
  @UseGuards(AuthGuard('jwt'))
  async generateFacture(@Req() req: any, @Body() createFactureDTO: CreateFactureDTO) {
    console.log('Received request to generate invoice:', { userId: req.user?._id, createFactureDTO });
    if (!req.user || !req.user._id) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }
    const userId = req.user._id;
    return this.FacturesService.generateInvoice(userId, createFactureDTO);
  }
  

  
  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getUserFactures(@Req() req: any) {
    const userId = req.user.id;
    return this.FacturesService.getUserInvoices(userId);
  }
  
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getFacture(@Param('id') id: string) {
    return this.FacturesService.getInvoiceById(id);
  }
  
  @Post(':id/pay')
 @UseGuards(AuthGuard('jwt'))
  async markFactureAsPaid(@Param('id') id: string) {
    return this.FacturesService.markInvoiceAsPaid(id);
  }
}