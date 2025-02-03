import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateProductSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório'),
    description: z.string().optional(),
    price: z.number().min(0, 'Preço deve ser maior que 0'),
    quantity: z.number().int().min(0, 'Quantidade deve ser maior que 0'),
    images: z.string().url('Imagem deve ser uma URL válida'),
  })
  .strict();

export class CreateProductDto {
  @ApiProperty({
    example: 'Produto Exemplo',
    description: 'Nome do produto',
    type: 'string',
  })
  name: string;

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
  })
  price: number;

  @ApiProperty({
    example: 10,
    description: 'Quantidade em estoque',
    type: 'number',
    minimum: 0,
  })
  quantity: number;

  @ApiProperty({
    example: 'https://exemplo.com/imagem.jpg',
    description: 'URL da imagem do produto',
    type: 'string',
  })
  images: string;
}

export type CreateProductType = z.infer<typeof CreateProductSchema>;
