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
    const invoice = await this.FacturesService.generateInvoice(userId, createFactureDTO);
    return { ...invoice, id: invoice._id.toString() }; 
  }
  

  
  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getUserFactures(@Req() req: any) {
    console.log('User object:', req.user);
    if (!req.user) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }
  
    const userId = req.user._id || req.user.id;
    console.log('Using user ID:', userId);
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
    console.log(`Marking invoice ${id} as paid`);
    return this.FacturesService.markInvoiceAsPaid(id);
  }
}