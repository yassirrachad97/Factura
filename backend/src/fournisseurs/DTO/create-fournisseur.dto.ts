import { IsNotEmpty, IsString } from 'class-validator';

export class CreatefournisseurDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  logo: Express.Multer.File;
}