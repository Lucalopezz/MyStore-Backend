import { z } from 'zod';

export const CreateProductSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório'),
    description: z.string().optional(),
    price: z.number().min(0, 'Preço deve ser maior que 0'),
    quantity: z.number().int().min(0, 'Quantidade deve ser maior que 0'),
    images: z.string().url('Imagem deve ser uma URL válida'),
  })
  .strict();

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
