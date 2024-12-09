import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [UsersModule, TodosModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
