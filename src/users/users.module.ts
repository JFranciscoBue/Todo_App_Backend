import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { Todo } from 'src/entities/Todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Todo])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
