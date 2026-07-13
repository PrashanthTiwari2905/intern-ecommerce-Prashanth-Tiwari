import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
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
findAll(
  @Query('page') page?: string,
  @Query('limit') limit?: string,
  @Query('search') search?: string,
) {
  return this.productService.findAll(
    Number(page) || 1,
    Number(limit) || 10,
    search,
  );
}


  @Get(':id')
findOne(
  @Param('id', ParseIntPipe)
  id: number,
) {
  return this.productService.findOne(id);
}
}
