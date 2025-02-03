import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginDtoSchema } from './dto/login.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validator.pipe';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiCreatedResponse({ type: LoginDto })
  login(@Body(new ZodValidationPipe(LoginDtoSchema)) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
