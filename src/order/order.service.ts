import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    try {
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
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException(
        'Serviço temporariamente indisponível.',
      );
    }
  }
  async findAll(userId: string) {
    try {
      return this.prisma.order.findMany({
        where: { userId },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException(
        'Serviço temporariamente indisponível.',
      );
    }
  }

  async findOne(userId: string, id: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
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

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }
  async updateStatus(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    try {
      await this.prisma.order.update({
        where: { id },
        data: {
          status: updateOrderDto.status,
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });
      return { message: 'Pedido atualizado com sucesso!' };
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException(
        'Serviço temporariamente indisponível.',
      );
    }
  }
}
