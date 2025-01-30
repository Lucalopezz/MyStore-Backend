import { z } from 'zod';

export const addProductSchema = z
  .object({
    productId: z.number(),
    quantity: z.number().min(1, 'Não há produtos em estoque'),
  })
  .strict();

export type addProductDto = z.infer<typeof addProductSchema>;
