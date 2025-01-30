import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        id: createOrderDto.cartId,
        userId,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          status: 'processando',
          products: {
            create: cart.products.map((cp) => ({
              productId: cp.productId,
              quantity: cp.quantity,
            })),
          },
        },
        include: {
          // usado para retornar dados relacionados junto com o pedido
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      // atualiza estoque dos produtos
      for (const cartProduct of cart.products) {
        await tx.product.update({
          where: { id: cartProduct.productId },
          data: {
            quantity: {
              decrement: cartProduct.quantity,
            },
          },
        });
      }

      // limpar o carrinho
      await tx.cart.delete({
        where: { id: cart.id },
      });

      return order;
    });
  }
}
