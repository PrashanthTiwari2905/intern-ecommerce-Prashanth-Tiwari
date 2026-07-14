import {
  IsInt,
  IsPositive,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {

  @ApiProperty({
    example: 1,
  })  
  @IsInt()
  productId!: number;

  @ApiProperty({
    example: 2,
  })
  @IsInt()
  @IsPositive()
  quantity!: number;
}