import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, ChangePasswordDto } from 'src/dtos/User.dto';
import { User } from 'src/entities/User.entity';
import { validUserDto } from '../utils/validateDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('new')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() user: CreateUserDto) {
    if (validUserDto(user)) {
      const newUser: User = await this.usersService.createUser(user);

      const { password, ...notPassword } = newUser;

      return notPassword;
    } else {
      throw new BadRequestException('Todos los campos son obligatorios');
    }
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async allUsers() {
    const users: User[] = await this.usersService.allUsers();

    if (!users) {
      return 'No hay Usuarios Registrados en la plataforma';
    }

    return {
      message: 'Todos los usuarios',
      users,
    };
  }

  @Put('newPassword/:id')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id') id: string,
    @Body() newPassword: ChangePasswordDto,
  ) {
    const { password } = newPassword;
    return await this.usersService.changePassword(id, password);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.deleteUser(id);
  }
}
