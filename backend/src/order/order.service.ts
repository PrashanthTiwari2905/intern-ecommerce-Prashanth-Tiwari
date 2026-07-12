import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async checkout(userId: number) {
    const cartItems =
      await this.prisma.cartItem.findMany({
        where: {
          userId,
        },
        include: {
          product: true,
        },
      });

    if (cartItems.length === 0) {
      throw new BadRequestException(
        'Cart is empty',
      );
    }

    const total = cartItems.reduce(
      (sum, item) =>
        sum +
        item.quantity * item.product.price,
      0,
    );

    const order =
      await this.prisma.order.create({
        data: {
          userId,
          total,
        },
      });

    for (const item of cartItems) {
      await this.prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
      });
    }

    await this.prisma.cartItem.deleteMany({
      where: {
        userId,
      },
    });

    return order;
  }

  async getOrders(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getOrderById(
    userId: number,
    orderId: number,
  ) {
    return this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}