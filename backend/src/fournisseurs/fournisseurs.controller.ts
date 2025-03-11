import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FournisseursService } from './fournisseurs.service';
import { CreatefournisseurDTO } from './DTO/create-fournisseur.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schema/user.schema';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdatefournisseurDTO } from './DTO/update-fournisseur.dto';

@Controller('fournisseurs')
@UseGuards(AuthGuard('jwt'), RolesGuard) 
export class FournisseursController {
  constructor(private readonly fournisseursService: FournisseursService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: './uploads/',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname)); 
      },
    }),
  }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFournisseurDto: CreatefournisseurDTO
  ) {
    console.log('Données reçues:', createFournisseurDto);
    console.log('Fichier reçu:', file);
  
    if (file) {
      createFournisseurDto.logo = `/uploads/${file.filename}`; 
    } else {
      createFournisseurDto.logo = null; 
    }
  
    return this.fournisseursService.create(createFournisseurDto);
  }
  
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Query('categoryId') categoryId?: string) {
    if (categoryId) {
      return this.fournisseursService.findByCategory(categoryId);
    }
    return this.fournisseursService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  
  async findOne(@Param('id') id: string) {
    return this.fournisseursService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN) 
  @UseInterceptors(FileInterceptor('logo'))
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() updateFournisseurDto: any,  // Contient les autres champs comme name, description, category
    @UploadedFile() logo: Express.Multer.File,  // Logo si envoyé
  ) {

    if (!id) {
      throw new Error("ID manquant dans l'URL");
    }
    // Si un logo est envoyé, ajouter ou remplacer le logo dans le DTO
    if (logo) {
      updateFournisseurDto.logo = logo.filename;  // Garde juste le nom du fichier ou le path du logo
    }

    // Mettre à jour le fournisseur dans la base de données
    return this.fournisseursService.update(id, updateFournisseurDto);  // Appel au service pour mettre à jour
  }

  

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string) {
    return this.fournisseursService.delete(id);
  }
}
