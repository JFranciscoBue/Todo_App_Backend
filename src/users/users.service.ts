import { BadRequestException, Injectable } from '@nestjs/common';
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

  async createUser(user: CreateUserDto) {
    const { email, fullname, password } = user;
    const userExist = await this.usersRepository.findOne({
      where: { email },
    });

    if (userExist) {
      throw new BadRequestException('El correo electronico ya esta en uso');
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      email,
      fullname,
      password: hashedPass,
    });

    await this.usersRepository.save(newUser);
    return newUser;
  }
}
