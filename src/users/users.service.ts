import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/User.dto';
import { User } from 'src/entities/User.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async allUsers(): Promise<User[] | string> {
    const users = await this.usersRepository.find({
      relations: {
        todos: true,
      },
    });

    if (!users) {
      return 'No hay usuario Registrados en la aplicacion';
    }

    return users;
  }

  async changePassword(id: string, newPassword: string): Promise<Object> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatedResult = await this.usersRepository.update(user.id, {
      password: hashedNewPassword,
    });

    return {
      success: 'Contraseña Cambiada Exitosamente!',
      updatedResult,
    };
  }

  async deleteUser(id: string): Promise<Object> {
    const deletedResult = await this.usersRepository.delete(id);

    if (deletedResult.affected === 0) {
      throw new NotFoundException('El usuario no existe');
    }

    return {
      success: 'Usuario Eliminado Correctamente',
      deletedResult,
    };
  }
}
