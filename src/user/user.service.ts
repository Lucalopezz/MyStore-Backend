import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { HashingService } from 'src/auth/hashing/hashing.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await this.hashingService.hash(createUserDto.password);
    try {
      const userData = {
        username: createUserDto.username,
        email: createUserDto.email,
        passwordHash,
      };
      const newUser = await this.prisma.user.create({
        data: userData,
      });
      return newUser;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('E-mail já cadastrado.');
      }

      throw error;
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${updateUserDto} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
