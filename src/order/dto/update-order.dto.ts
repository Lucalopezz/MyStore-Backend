import { z } from 'zod';

export const OrderStatus = z.enum([
  'processando',
  'confirmado',
  'enviado',
  'entregue',
  'cancelado',
]);
export type OrderStatus = z.infer<typeof OrderStatus>;

export const UpdateOrderSchema = z.object({
  status: OrderStatus,
});

export type UpdateOrderDto = z.infer<typeof UpdateOrderSchema>;
