import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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

  @Get(':id')
findOne(
  @Param('id', ParseIntPipe)
  id: number,
) {
  return this.productService.findOne(id);
}
}
