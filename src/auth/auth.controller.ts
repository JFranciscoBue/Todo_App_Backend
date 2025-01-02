import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dtos/Login.dto';
import { CreateUserDto } from 'src/dtos/User.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async register(@Body() data: CreateUserDto, @Res() res: Response) {
    try {
      const response = await this.authService.signUp(data);
      res.status(201).json({
        success: 'Registro completado',
        response,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }

  @Post('signin')
  async login(@Body() credentials: LoginDto, @Res() res: Response) {
    try {
      const response = await this.authService.signIn(credentials);
      res.status(200).json({
        success: 'Sesion iniciada Correctamente',
        response,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
}
