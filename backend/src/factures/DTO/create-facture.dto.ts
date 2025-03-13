import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateFactureDTO {
  @IsNotEmpty()
  @IsString()
  fournisseurId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @IsNotEmpty()
  @IsString()
  contractNumber: string;

  @IsNotEmpty()
  @IsString()
  serviceType: string;

  @IsNotEmpty()
  @IsString()
  serviceName: string;
}