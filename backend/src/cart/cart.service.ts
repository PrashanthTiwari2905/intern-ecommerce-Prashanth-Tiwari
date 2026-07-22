import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from 
'../prisma/prisma.service';
import { AddToCartDto } from 
'./dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async addToCart(
    userId: number,
    addToCartDto: AddToCartDto,
  ) {
    const { productId, quantity } =
      addToCartDto;

    const product =
      await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!product) {
      throw new BadRequestException(
        'Product not found',
      );
    }

    const existingCartItem =
      await this.prisma.cartItem.findFirst({
        where: {
          userId,
          productId,
        },
      });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new BadRequestException(`Cannot add more than available stock (${product.stock})`);
      }
      return this.prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });
    }

    if (quantity > product.stock) {
      throw new BadRequestException(`Cannot add more than available stock (${product.stock})`);
    }

    return this.prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });
  }

  async getCart(userId: number) {
    return this.prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });
  }

  async updateCartItem(
    userId: number,
    cartItemId: number,
    quantity: number,
  ) {
    const cartItem =
      await this.prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          userId,
        },
        include: {
          product: true,
        },
      });

    if (!cartItem) {
      throw new BadRequestException(
        'Cart item not found',
      );
    }

    if (quantity > cartItem.product.stock) {
      throw new BadRequestException(`Cannot update quantity beyond available stock (${cartItem.product.stock})`);
    }

    return this.prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity,
      },
    });
  }

  async removeCartItem(
    userId: number,
    cartItemId: number,
  ) {
    const cartItem =
      await this.prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          userId,
        },
      });

    if (!cartItem) {
      throw new BadRequestException(
        'Cart item not found',
      );
    }

    await this.prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    return {
      message: 'Item removed from cart',
    };
  }
}