import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from 'src/entities/Todo.entity';
import { Category } from 'src/entities/Category.entity';
import { User } from 'src/entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, Category, User])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
