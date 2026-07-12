import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  @Post('checkout')
  checkout(
    @CurrentUser() user: any,
  ) {
    return this.orderService.checkout(
      user.id,
    );
  }

  @Get()
  getOrders(
    @CurrentUser() user: any,
  ) {
    return this.orderService.getOrders(
      user.id,
    );
  }

  @Get(':id')
  getOrderById(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.orderService.getOrderById(
      user.id,
      id,
    );
  }
}