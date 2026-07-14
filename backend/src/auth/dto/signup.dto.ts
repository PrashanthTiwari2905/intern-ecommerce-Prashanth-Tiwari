import {
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    example: 'Prashanth Tiwari',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'prashanth@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123',
  })
  @MinLength(6)
  password!: string;
}