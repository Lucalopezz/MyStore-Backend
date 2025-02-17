import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const UpdateUserSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
      .max(128, { message: 'A senha deve ter no máximo 128 caracteres.' })
      .optional(),
    username: z
      .string()
      .min(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres.' })
      .max(50, {
        message: 'O nome de usuário deve ter no máximo 50 caracteres.',
      })
      .optional(),
  })
  .strict();

export class UpdateUserDto {
  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha do usuário',
    type: 'string',
    minLength: 8,
    maxLength: 128,
  })
  password: string;

  @ApiProperty({
    example: 'nomeusuario',
    description: 'Nome de usuário',
    type: 'string',
    minLength: 3,
    maxLength: 50,
  })
  username: string;
}

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
