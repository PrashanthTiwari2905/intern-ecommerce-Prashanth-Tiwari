import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsNumber()
  price!: number;

  @IsInt()
  stock!: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}