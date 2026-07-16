import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async checkout(userId: number) {
    // Step 1: Fetch all cart items with product details
    const cartItems =
      await this.prisma.cartItem.findMany({
        where: {
          userId,
        },
        include: {
          product: true,
        },
      });

    // Prevent checkout if cart is empty
    if (cartItems.length === 0) {
      throw new BadRequestException(
        'Cart is empty',
      );
    }

    // Step 2: Calculate total order amount
    const total = cartItems.reduce(
      (sum, item) =>
        sum +
        item.quantity * item.product.price,
      0,
    );

    // Step 3: Execute everything inside a transaction
    return this.prisma.$transaction(
      async (tx) => {
        // Create Order
        const order =
          await tx.order.create({
            data: {
              userId,
              total,
            },
          });

        // Create all Order Items together
        await tx.orderItem.createMany({
          data: cartItems.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        });

        // Clear user's cart
        await tx.cartItem.deleteMany({
          where: {
            userId,
          },
        });

        return order;
      },
    );
  }

  async getOrders(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },

      orderBy: {
        id: 'desc',
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
    const order =
      await this.prisma.order.findFirst({
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

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    return order;
  }
}