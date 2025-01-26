import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { BcryptService } from './hashing/bycript.service';
import jwtConfig from './config/jwt.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthService,
  ],
  exports: [HashingService, JwtModule, ConfigModule],
  controllers: [AuthController],
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class AuthModule {}
