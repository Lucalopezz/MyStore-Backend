import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { User } from 'src/common/decorators/get-userId-from-token.decorator';
import { addProductDto, addProductSchema } from './dto/add-product.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validator.pipe';

@Controller('cart')
@UseGuards(AuthTokenGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@User('sub') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('products')
  addProduct(
    @User('sub') userId: string,
    @Body(new ZodValidationPipe(addProductSchema)) addProductDto: addProductDto,
  ) {
    return this.cartService.addProduct(userId, addProductDto);
  }

  @Delete('products/:productId')
  removeProduct(
    @User('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeProduct(userId, +productId);
  }
}
