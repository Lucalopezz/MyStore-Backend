import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      );

      const userData = {
        username: createUserDto.username,
        email: createUserDto.email,
        passwordHash,
      };

      const newUser = await this.prisma.user.create({
        data: userData,
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });

      return {
        message: 'Usuário criado com sucesso',
        user: newUser,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('E-mail já cadastrado');
        }
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Create User Error:', error);
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });

      return {
        message: 'Usuários recuperados com sucesso',
        users,
        total: users.length,
      };
    } catch (error) {
      console.error('Find All Users Error:', error);
      throw new InternalServerErrorException('Erro ao buscar usuários');
    }
  }

  async findOneByToken(id: string, userId: string) {
    if (userId !== id) {
      return { message: 'Erro! esse Id não é seu' };
    }
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return {
        user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Find One User Error:', error);
      throw new InternalServerErrorException('Erro ao buscar usuário');
    }
  }
  async findOneById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return {
        message: 'Usuário recuperado com sucesso',
        user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Find One User Error:', error);
      throw new InternalServerErrorException('Erro ao buscar usuário');
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    tokenPayload: TokenPayloadDto,
  ) {
    try {
      if (id !== tokenPayload.sub) {
        throw new ForbiddenException('Você não pode atualizar outra pessoa');
      }

      await this.findOneById(id);

      const userData: { username?: string; passwordHash?: string } = {};

      if (updateUserDto?.username) {
        userData.username = updateUserDto.username;
      }

      if (updateUserDto?.password) {
        userData.passwordHash = await this.hashingService.hash(
          updateUserDto.password,
        );
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: userData,
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      return {
        message: 'Usuário atualizado com sucesso',
        user: updatedUser,
      };
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.error('Update User Error:', error);
      throw new InternalServerErrorException('Erro ao atualizar usuário');
    }
  }

  async remove(id: string) {
    try {
      await this.findOneById(id);

      const deletedUser = await this.prisma.user.delete({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      return {
        message: 'Usuário removido com sucesso',
        user: deletedUser,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Remove User Error:', error);
      throw new InternalServerErrorException('Erro ao remover usuário');
    }
  }
}
