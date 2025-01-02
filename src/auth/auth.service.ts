import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/dtos/Login.dto';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dtos/User.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(data: CreateUserDto): Promise<Object> {
    const { email } = data;
    const userExist = await this.usersRepository.findOne({
      where: { email },
    });

    if (userExist) {
      throw new BadRequestException('El correo Electronico ya esta en uso');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.usersRepository.save({
      ...data,
      password: hashedPassword,
    });

    const { password, ...userWithOutPassword } = newUser;

    return userWithOutPassword;
  }

  async signIn(credentials: LoginDto): Promise<string> {
    const { email, password } = credentials;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('El usuario no existe');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new BadRequestException('Contraseña Invalida');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email,
    });
    console.log(token);

    return token;
  }
}
