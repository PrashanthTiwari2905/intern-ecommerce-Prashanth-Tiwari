import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common'; 

import {
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { ProductService } from 
'./product.service';
import { CreateProductDto } from 
'./dto/create-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: 
ProductService,
  ) {}

@ApiOperation({
  summary:
    'Create a new product',
})

  @Post()
  create(
    @Body()
    createProductDto: CreateProductDto,
  ) {
    return this.productService.create(
      createProductDto,
    );
  }

@ApiOperation({
  summary:
    'Import products from external API',
})

@Post('seed')
seedProducts() {
  return this.productService.seedProducts();
}

@ApiOperation({
  summary:
    'Get all products with pagination and search',
})

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


@ApiOperation({
  summary:
    'Get product by ID',
})

  @Get(':id')
findOne(
  @Param('id', ParseIntPipe)
  id: number,
) {
  return this.productService.findOne(id);
}
}
