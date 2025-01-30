import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService],
  imports: [AuthModule],
})
export class CartModule {}
