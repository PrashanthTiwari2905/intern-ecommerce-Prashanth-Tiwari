import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

import { JwtAuthGuard } from 
'../auth/guards/jwt-auth.guard';
import { CurrentUser } from 
'../auth/decorators/current-user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private readonly cartService: CartService,
  ) {}

  @Post('add')
  addToCart(
    @CurrentUser() user: any,
    @Body()
    addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(
      user.id,
      addToCartDto,
    );
  }

  @Get()
  getCart(
    @CurrentUser() user: any,
  ) {
    return this.cartService.getCart(
      user.id,
    );
  }

  @Patch(':id')
updateCartItem(
  @CurrentUser() user: any,
  @Param('id', ParseIntPipe)
  id: number,
  @Body()
  body: { quantity: number },
) {
  return this.cartService.updateCartItem(
    user.id,
    id,
    body.quantity,
  );
}

@Delete(':id')
removeCartItem(
  @CurrentUser() user: any,
  @Param('id', ParseIntPipe)
  id: number,
) {
  return this.cartService.removeCartItem(
    user.id,
    id,
  );
}
}
