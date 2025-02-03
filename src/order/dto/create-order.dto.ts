import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateOrderSchema = z.object({
  cartId: z.number().int().positive(),
});

export class CreateOrderDto {
  @ApiProperty({
    example: 1,
    description: 'ID do carrinho',
    type: 'number',
    minimum: 1,
  })
  cartId: number;
}

export type CreateOrderType = z.infer<typeof CreateOrderSchema>;
