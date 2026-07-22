import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

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
    private readonly productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

@ApiOperation({
  summary:
    'Create a new product',
})

  @Post()
  async create(
    @Body()
    createProductDto: CreateProductDto,
  ) {
    // Invalidate Cache on Change
    await this.cacheManager.clear(); 
    return this.productService.create(createProductDto);
  }

@ApiOperation({
  summary:
    'Import products from external API',
})

@Post('seed')
async seedProducts() {
  // Invalidate Cache on Change
  await this.cacheManager.clear();
  return this.productService.seedProducts();
}

@ApiOperation({
  summary:
    'Get all products with pagination and search',
})

 @Get()
 @UseInterceptors(CacheInterceptor)
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
