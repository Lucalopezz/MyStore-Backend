import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { ZodValidationPipe } from 'src/pipes/zod-validator.pipe';
import { CreateOrderDto, CreateOrderSchema } from './dto/create-order.dto';
import { User } from 'src/common/decorators/get-userId-from-token.decorator';

@Controller('order')
@UseGuards(AuthTokenGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateOrderSchema))
    createOrderDto: CreateOrderDto,
    @User('sub') userId: string,
  ) {
    return this.orderService.create(userId, createOrderDto);
  }
}
