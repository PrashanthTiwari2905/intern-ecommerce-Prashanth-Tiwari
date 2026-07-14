import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Orders')
@ApiBearerAuth()

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {}
  

  @ApiOperation({
  summary:
    'Checkout and create order',
})
  @Post('checkout')
  checkout(
    @CurrentUser() user: any,
  ) {
    return this.orderService.checkout(
      user.id,
    );
  }

  @ApiOperation({
  summary:
    'Get all orders',
})
  @Get()
  getOrders(
    @CurrentUser() user: any,
  ) {
    return this.orderService.getOrders(
      user.id,
    );
  }

  @ApiOperation({
  summary: 'Get order details',
})
@ApiOkResponse({
  description: 'Order fetched successfully',
})
@ApiNotFoundResponse({
  description: 'Order not found',
})
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
}}