import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserSchema } from './create-user.dto';

export const UpdateUserSchema = CreateUserSchema.partial();

export class UpdateUserDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'Endereço de email do usuário',
    type: 'string',
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha do usuário',
    type: 'string',
    minLength: 8,
    maxLength: 128,
    required: false,
  })
  password?: string;

  @ApiProperty({
    example: 'nomeusuario',
    description: 'Nome de usuário',
    type: 'string',
    minLength: 3,
    maxLength: 50,
    required: false,
  })
  username?: string;
}

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
