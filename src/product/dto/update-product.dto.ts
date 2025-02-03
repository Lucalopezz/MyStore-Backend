import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { CreateProductSchema } from './create-product.dto';

export const UpdateProductSchema = CreateProductSchema.partial();

export class UpdateProductDto {
  @ApiProperty({
    example: 'Produto Exemplo',
    description: 'Nome do produto',
    type: 'string',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'Descrição detalhada do produto',
    description: 'Descrição do produto',
    type: 'string',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 99.99,
    description: 'Preço do produto',
    type: 'number',
    minimum: 0,
    required: false,
  })
  price?: number;

  @ApiProperty({
    example: 10,
    description: 'Quantidade em estoque',
    type: 'number',
    minimum: 0,
    required: false,
  })
  quantity?: number;

  @ApiProperty({
    example: 'https://exemplo.com/imagem.jpg',
    description: 'URL da imagem do produto',
    type: 'string',
    required: false,
  })
  images?: string;
}

export type UpdateProductType = z.infer<typeof UpdateProductSchema>;
