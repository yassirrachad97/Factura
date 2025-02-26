import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { FacturesService } from './factures.service';
import { CreateFactureDTO } from './DTO/create-facture.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('invoices')
export class FacturesController {
  constructor(private readonly FacturesService: FacturesService) {}

  @Post('generate')
//   @UseGuards(JwtAuthGuard)
  async generateFacture(
    @Req() req: any,
    @Body() createFactureDTO: CreateFactureDTO,
  ) {
    const userId = req.user.id; 
    return this.FacturesService.generateInvoice(userId, createFactureDTO);
  }
}