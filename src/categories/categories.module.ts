import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/Category.entity';
import { Todo } from 'src/entities/Todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Todo])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
