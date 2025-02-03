import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateUserSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'O email deve ser um endereço válido.' }),
    password: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
      .max(128, { message: 'A senha deve ter no máximo 128 caracteres.' }),
    username: z
      .string()
      .min(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres.' })
      .max(50, {
        message: 'O nome de usuário deve ter no máximo 50 caracteres.',
      }),
  })
  .strict();

export class CreateUserDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'Endereço de email do usuário',
    type: 'string',
  })
  email: string;

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

export type CreateUserType = z.infer<typeof CreateUserSchema>;
