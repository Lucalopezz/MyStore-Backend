import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Prisma } from '@prisma/client';

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

      if (cart.products.length === 0) {
        throw new BadRequestException('Carrinho vazio');
      }

      return this.prisma.$transaction(async (tx) => {
        // verifica disponibilidade de estoque antes de criar o pedido
        for (const cartProduct of cart.products) {
          const product = await tx.product.findUnique({
            where: { id: cartProduct.productId },
          });

          if (!product || product.quantity < cartProduct.quantity) {
            throw new BadRequestException(
              `Produto ${cartProduct.productId} sem estoque suficiente`,
            );
          }
        }

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
            products: {
              include: {
                product: true,
              },
            },
          },
        });

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

        // limpa o carrinho
        await tx.cart.delete({
          where: { id: cart.id },
        });

        return {
          message: 'Pedido criado com sucesso',
          order,
        };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Prisma Error:', error);
        throw new InternalServerErrorException('Erro ao processar pedido');
      }
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.error('Unexpected Error:', error);
      throw new ServiceUnavailableException(
        'Serviço temporariamente indisponível',
      );
    }
  }

  async findAll(userId: string) {
    try {
      const orders = await this.prisma.order.findMany({
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

      return {
        message: 'Pedidos recuperados com sucesso',
        orders,
        total: orders.length,
      };
    } catch (error) {
      console.error('Find All Orders Error:', error);
      throw new ServiceUnavailableException(
        'Serviço temporariamente indisponível',
      );
    }
  }

  async findOne(userId: string, id: number) {
    try {
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

      return {
        message: 'Pedido recuperado com sucesso',
        order,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Find One Order Error:', error);
      throw new ServiceUnavailableException(
        'Serviço temporariamente indisponível',
      );
    }
  }

  async updateStatus(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.prisma.order.findFirst({
        where: { id },
      });

      if (!order) {
        throw new NotFoundException('Pedido não encontrado');
      }

      const updatedOrder = await this.prisma.order.update({
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

      return {
        message: 'Status do pedido atualizado com sucesso',
        order: updatedOrder,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Update Order Status Error:', error);
      throw new ServiceUnavailableException(
        'Serviço temporariamente indisponível',
      );
    }
  }
}
