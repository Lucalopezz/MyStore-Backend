import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { addProductDto } from './dto/add-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    try {
      let cart = await this.prisma.cart.findFirst({
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
        cart = await this.prisma.cart.create({
          data: { userId },
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
      console.error('Get Cart Error:', error);
      throw new ServiceUnavailableException(
        'Serviço temporariamente indisponível',
      );
    }
  }

  async addProduct(userId: string, addProductDto: addProductDto) {
    try {
      const { productId, quantity } = addProductDto;

      if (quantity <= 0) {
        throw new BadRequestException('Quantidade inválida');
      }

      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }

      if (product.quantity < quantity) {
        throw new BadRequestException('Quantidade em estoque insuficiente');
      }

      const cart = await this.prisma.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
      });

      const cartProduct = await this.prisma.cartProduct.upsert({
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

      return {
        message: 'Produto adicionado com sucesso',
        cartProduct,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Prisma Error:', error);
        throw new InternalServerErrorException(
          'Erro ao adicionar produto ao carrinho',
        );
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

  async removeProduct(userId: string, productId: number) {
    try {
      const cart = await this.prisma.cart.findFirst({
        where: { userId },
      });

      if (!cart) {
        throw new NotFoundException('Carrinho não encontrado');
      }

      const deletedProduct = await this.prisma.cartProduct.delete({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
        include: {
          product: true,
        },
      });

      return {
        message: 'Produto removido com sucesso',
        deletedProduct,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Produto não encontrado no carrinho');
        }
        console.error('Prisma Error:', error);
        throw new InternalServerErrorException(
          'Erro ao remover produto do carrinho',
        );
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Unexpected Error:', error);
      throw new ServiceUnavailableException(
        'Serviço temporariamente indisponível',
      );
    }
  }
}
