import { Injectable } from '@nestjs/common';
import { PrismaService } from 
'../prisma/prisma.service';
import { CreateProductDto } from 
'./dto/create-product.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany();
  }
  async seedProducts() {
  const response = await firstValueFrom(
    this.httpService.get(
      'https://dummyjson.com/products',
    ),
  );

  const products = response.data.products;

  for (const product of products) {
    await this.prisma.product.create({
      data: {
        name: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.thumbnail,
      },
    });
  }

  return {
    message: `${products.length} products imported`,
  };
}
}
