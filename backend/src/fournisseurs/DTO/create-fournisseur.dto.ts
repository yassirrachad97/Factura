import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatefournisseurDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional() // Le logo peut être vide
  @IsString() // Il contiendra le chemin du fichier
  logo?: string;
}