import { z } from 'zod';

export const CreateOrderSchema = z.object({
  cartId: z.number().int().positive(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
