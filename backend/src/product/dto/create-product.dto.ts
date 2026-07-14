import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {

  @ApiProperty({
  example: 'iPhone 16',
})
  @IsString()
  name!: string;

  @ApiProperty({
  example: 'Apple smartphone',
})
  @IsString()
  description!: string;

  @ApiProperty({
  example: 79999,
})
  @IsNumber()
  price!: number;

  @ApiProperty({
  example: 10,
})
  @IsInt()
  stock!: number;

  @ApiProperty({
  example:
    'https://example.com/iphone.jpg',
})
  @IsOptional()
  @IsString()
  imageUrl?: string;
}


