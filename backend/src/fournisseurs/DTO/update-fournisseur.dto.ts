import { IsString, IsOptional } from 'class-validator';

export class UpdatefournisseurDTO {
  @IsOptional() @IsString()
  name?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsString()
  category?: string;
}
