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

  @IsOptional() 
  @IsString() 
  logo?: string;
}