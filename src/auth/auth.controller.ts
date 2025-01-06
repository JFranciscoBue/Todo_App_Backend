import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dtos/Login.dto';
import { CreateUserDto } from 'src/dtos/User.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async register(@Body() data: CreateUserDto) {
    return await this.authService.signUp(data);
  }

  @Post('signin')
  async login(@Body() credentials: LoginDto) {
    return await this.authService.signIn(credentials);
  }
}
