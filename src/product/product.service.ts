import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const data = {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        quantity: createProductDto.quantity,
        images: createProductDto.images,
      };

      const result = await this.prisma.product.create({ data });

      return {
        message: 'Produto criado com sucesso',
        product: result,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar produto');
    }
  }

  async findAll() {
    try {
      const products = await this.prisma.product.findMany();

      return {
        message: 'Produtos recuperados com sucesso',
        products,
        total: products.length,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar produtos');
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(`Produto com ID ${id} não encontrado`);
      }

      return {
        message: 'Produto recuperado com sucesso',
        product,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar produto');
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      await this.findOne(id);

      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });

      return {
        message: 'Produto atualizado com sucesso',
        product: updatedProduct,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao atualizar produto');
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);

      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });

      return {
        message: 'Produto removido com sucesso',
        product: deletedProduct,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao remover produto');
    }
  }
}
