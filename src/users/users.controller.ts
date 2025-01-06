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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async allUsers() {
    return await this.usersService.allUsers();
  }

  @Put('newPassword/:id')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() newPassword: string,
  ) {
    return await this.usersService.changePassword(id, newPassword);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.deleteUser(id);
  }
}
