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

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

import { JwtAuthGuard } from 
'../auth/guards/jwt-auth.guard';
import { CurrentUser } from 
'../auth/decorators/current-user.decorator';

@ApiTags('Cart')
@ApiBearerAuth()

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private readonly cartService: CartService,
  ) {}

  @ApiOperation({
  summary: 'Add product to cart',
})
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

  @ApiOperation({
  summary:
    'Get current user cart',
})
@Get()
  getCart(
    @CurrentUser() user: any,
  ) {
    return this.cartService.getCart(
      user.id,
    );
  }


  @ApiOperation({
  summary:
    'Update cart quantity',
})
@Patch(':id')
updateCartItem(
  @CurrentUser() user: any,
  @Param('id', ParseIntPipe)
  id: number,
  @Body()
updateCartDto: UpdateCartDto,
) {
  return this.cartService.updateCartItem(
    user.id,
    id,
    updateCartDto.quantity
  );
}

@ApiOperation({
  summary:
    'Delete cart item',
})
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
