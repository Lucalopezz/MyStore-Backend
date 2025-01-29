import { z } from 'zod';
import { CreateProductSchema } from './create-product.dto';

export const UpdateProductrSchema = CreateProductSchema.partial();

export type UpdateProductDto = z.infer<typeof CreateProductSchema>;
