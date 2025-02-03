import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const addProductSchema = z
  .object({
    productId: z.number(),
    quantity: z.number().min(1, 'Não há produtos em estoque'),
  })
  .strict();

export class addProductDto {
  @ApiProperty({
    example: 123,
    description: 'ID do produto',
    type: 'number',
  })
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Quantidade de produtos',
    type: 'number',
    minimum: 1,
  })
  quantity: number;
}

export type AddProductType = z.infer<typeof addProductSchema>;
