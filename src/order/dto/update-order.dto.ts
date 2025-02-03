import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const OrderStatus = z.enum([
  'processando',
  'confirmado',
  'enviado',
  'entregue',
  'cancelado',
]);

export class UpdateOrderDto {
  @ApiProperty({
    example: 'processando',
    description: 'Status do pedido',
    enum: ['processando', 'confirmado', 'enviado', 'entregue', 'cancelado'],
  })
  status: 'processando' | 'confirmado' | 'enviado' | 'entregue' | 'cancelado';
}

export type OrderStatusType = z.infer<typeof OrderStatus>;
export type UpdateOrderType = z.infer<typeof UpdateOrderSchema>;

export const UpdateOrderSchema = z.object({
  status: OrderStatus,
});
