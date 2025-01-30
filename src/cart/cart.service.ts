import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { addProductDto } from './dto/add-product.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
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
  }

  async addProduct(userId: string, addProductDto: addProductDto) {
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

    return this.prisma.cartProduct.upsert({
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
  }

  async removeProduct(userId: string, productId: number) {
    const cart = await this.getCart(userId);

    return this.prisma.cartProduct.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });
  }
}
