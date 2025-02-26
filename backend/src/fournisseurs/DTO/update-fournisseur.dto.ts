import { IsString } from 'class-validator';

export class UpdatefournisseurDTO {
    @IsString()
    name?: string;
  
    @IsString()
    icon?: string;
  }