import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    icon: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    order?: number;

    @IsString()
    @IsOptional()
    group?: string;
}