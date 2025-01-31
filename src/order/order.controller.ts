import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { ZodValidationPipe } from 'src/pipes/zod-validator.pipe';
import { CreateOrderDto, CreateOrderSchema } from './dto/create-order.dto';
import { User } from 'src/common/decorators/get-userId-from-token.decorator';
import { UpdateOrderDto, UpdateOrderSchema } from './dto/update-order.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { REQUEST_ADM } from 'src/auth/auth.constants';
import { Roles } from 'src/auth/decorator/roles.decorator';

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

  @Get()
  findAll(@User('sub') userId: string) {
    return this.orderService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User('sub') userId: string) {
    return this.orderService.findOne(userId, +id);
  }

  @Patch(':id/status')
  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(REQUEST_ADM)
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateOrderSchema))
    updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateStatus(+id, updateOrderDto);
  }
}
