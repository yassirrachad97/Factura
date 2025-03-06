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
} from '@nestjs/common';
import { FournisseursService } from './fournisseurs.service';
import { CreatefournisseurDTO } from './DTO/create-fournisseur.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schema/user.schema';

@Controller('fournisseurs')
@UseGuards(AuthGuard('jwt'), RolesGuard) 
export class FournisseursController {
  constructor(private readonly fournisseursService: FournisseursService) {}

  @Post()
  @Roles(UserRole.ADMIN) 
  async create(@Body() createFournisseurDto: CreatefournisseurDTO) {
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
  async update(
    @Param('id') id: string,
    @Body() updateFournisseurDto: CreatefournisseurDTO,
  ) {
    return this.fournisseursService.update(id, updateFournisseurDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    return this.fournisseursService.delete(id);
  }
}