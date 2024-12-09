import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, TodosModule, CategoriesModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
