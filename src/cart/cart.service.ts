import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { addProductDto } from './dto/add-product.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    try {
      const cart = await this.prisma.cart.findFirst({
        where: { userId },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart) {
        return this.prisma.cart.create({
          data: {
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
      }

      return cart;
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException(
        'Serviço temporariamente indisponível.',
      );
    }
  }

  async addProduct(userId: string, addProductDto: addProductDto) {
    try {
      const { productId, quantity } = addProductDto;

      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(`Produto nâo encontrado`);
      }

      const cart = await this.prisma.cart.upsert({
        where: {
          userId,
        },
        create: {
          userId,
        },
        update: {},
      });

      await this.prisma.cartProduct.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
        create: {
          cartId: cart.id,
          productId,
          quantity,
        },
        update: {
          quantity,
        },
      });
      return { message: 'Produto adicionado com sucesso!' };
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException(
        'Serviço temporariamente indisponível.',
      );
    }
  }

  async removeProduct(userId: string, productId: number) {
    try {
      const cart = await this.getCart(userId);

      await this.prisma.cartProduct.delete({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });
      return { message: 'Produto removido com sucesso!' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Carrinho não existe');
      }
      throw new Error(error);
    }
  }
}
