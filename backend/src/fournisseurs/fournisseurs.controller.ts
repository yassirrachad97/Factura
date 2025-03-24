
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
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FournisseursService } from './fournisseurs.service';
import { CreatefournisseurDTO } from './dto/create-fournisseur.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schema/user.schema';
import { UpdatefournisseurDTO } from './dto/update-fournisseur.dto';
import { S3Service } from '../s3/s3.service';

@Controller('fournisseurs')
@UseGuards(AuthGuard('jwt'), RolesGuard) 
export class FournisseursController {
  constructor(
    private readonly fournisseursService: FournisseursService,
    private readonly s3Service: S3Service
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('logo', {
    limits: {
      fileSize: 5 * 1024 * 1024, 
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new BadRequestException('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFournisseurDto: CreatefournisseurDTO
  ) {
    
  
    if (file) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileKey = `fournisseurs/${uniqueSuffix}-${file.originalname}`;
      
   
      const fileUrl = await this.s3Service.uploadFile(file, fileKey);
      
      
      createFournisseurDto.logo = fileUrl;
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
  @UseInterceptors(FileInterceptor('logo', {
    limits: {
      fileSize: 5 * 1024 * 1024, 
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new BadRequestException('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() updateFournisseurDto: UpdatefournisseurDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!id) {
      throw new BadRequestException("ID manquant dans l'URL");
    }
    
  
    if (file) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileKey = `fournisseurs/${uniqueSuffix}-${file.originalname}`;
      

      const fileUrl = await this.s3Service.uploadFile(file, fileKey);
      
   
      updateFournisseurDto.logo = fileUrl;
    }

  
    return this.fournisseursService.update(id, updateFournisseurDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string) {
    return this.fournisseursService.delete(id);
  }
}