import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const LoginDtoSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'O email deve ser um endereço válido.' }),
    password: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
      .max(128, { message: 'A senha deve ter no máximo 128 caracteres.' }),
  })
  .strict();

export class LoginDto {
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
}

export type LoginType = z.infer<typeof LoginDtoSchema>;
