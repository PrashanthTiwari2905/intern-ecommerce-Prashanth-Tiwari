import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { ProductService } from 
'./product.service';
import { CreateProductDto } from 
'./dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: 
ProductService,
  ) {}

  @Post()
  create(
    @Body()
    createProductDto: CreateProductDto,
  ) {
    return this.productService.create(
      createProductDto,
    );
  }

@Post('seed')
seedProducts() {
  return this.productService.seedProducts();
}

  @Get()
  findAll() {
    return this.productService.findAll();
  }
}
