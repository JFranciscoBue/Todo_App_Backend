import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dtos/User.dto';
import { Response } from 'express';
import { User } from 'src/entities/User.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('new')
  @HttpCode(201)
  async createUser(@Body() user: CreateUserDto) {
    const newUser: User = await this.usersService.createUser(user);

    const { password, ...notPassword } = newUser;

    return notPassword;
  }
}
