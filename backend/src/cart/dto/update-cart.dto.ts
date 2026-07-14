import {
  IsInt,
  IsPositive,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {

  @ApiProperty({
    example: 4,
  })  
  @IsInt()
  @IsPositive()
  quantity!: number;
}