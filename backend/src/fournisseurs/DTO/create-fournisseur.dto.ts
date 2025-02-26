import { IsNotEmpty, IsString } from 'class-validator';

export class CreatefournisseurDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  icon: string;
}