import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async seedProducts() {
    // Delete old data first
    await this.prisma.cartItem.deleteMany();
    await this.prisma.orderItem.deleteMany();
    await this.prisma.product.deleteMany();

    // Fetch only 30 products
    const response = await firstValueFrom(
      this.httpService.get(
        'https://dummyjson.com/products?limit=30',
      ),
    );

    const products = response.data.products;

    // Insert products into DB
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
      message: '30 products imported',
    };
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    const products =
      await this.prisma.product.findMany({
        where,
        skip,
        take: limit,
      });

    const total =
      await this.prisma.product.count({
        where,
      });

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }
}