import {
    Controller,
    Get,
    Post,
Body,
    Param,
    Put,
    Delete,
  } from '@nestjs/common';
  import { FournisseursService } from './fournisseurs.service';
  import { CreatefournisseurDTO } from './DTO/create-fournisseur.dto';
  import { UpdatefournisseurDTO } from './DTO/update-fournisseur.dto';
  
  @Controller('fournisseurs')
  export class FournisseursController {
    constructor(private readonly fournisseursService: FournisseursService) {}
  
    @Post()
    async create(@Body() createfournisseurDTO: CreatefournisseurDTO) {
      return this.fournisseursService.creer(createfournisseurDTO);
    }
  
    @Get()
    async findAll() {
      return this.fournisseursService.trouverTous();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.fournisseursService.trouverUn(id);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updatefournisseurDTO: UpdatefournisseurDTO,
    ) {
      return this.fournisseursService.mettreAJour(id, updatefournisseurDTO);
    }
  
    @Delete(':id')
    async Delete(@Param('id') id: string) {
      return this.fournisseursService.supprimer(id);
    }
  }