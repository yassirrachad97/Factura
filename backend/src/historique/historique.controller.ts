import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { HistoriqueService } from './historique.service';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from '../auth/roles.guard';

  
  @Controller('historique')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  export class HistoriqueController {
    constructor(private readonly historiqueService: HistoriqueService) {}
  
  
  
  
    @Get('my-history')
    async findMyHistory(@Request() req) {
      const currentUser = req.user; 
      return this.historiqueService.findMyHistory(currentUser);
    }
  
   
  }