import {
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
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto } from 'src/dtos/Todo.dto';
import { authGuard } from '../guards/auth.guard';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(authGuard)
  async userTodos(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Object[] | string> {
    const todos = await this.todosService.userTodos(id);

    console.log(todos);

    if (todos.length === 0) {
      return 'No tienes tarea pendientes';
    } else {
      const allTodos = todos.map((todo) => {
        const { category } = todo;
        const cat = category.name;
        return {
          title: todo.title,
          description: todo.description,
          category: cat,
          isDone: todo.isDone,
        };
      });
      return allTodos;
    }
  }

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(authGuard)
  async addTodo(@Body() todo: CreateTodoDto): Promise<Object> {
    return await this.todosService.addTodo(todo);
  }

  @Put('status/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(authGuard)
  async updateStatus(@Param('id', ParseUUIDPipe) id: string): Promise<Object> {
    return await this.todosService.updateStatus(id);
  }

  @Put('update/category/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(authGuard)
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() categoryName: string,
  ): Promise<Object> {
    return await this.todosService.updateCategory(id, categoryName);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(authGuard)
  async updateTodo(
    @Body() updateTodo: UpdateTodoDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Object> {
    return await this.todosService.updateTodo(updateTodo, id);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(authGuard)
  async deleteTodo(@Param('id', ParseUUIDPipe) id: string): Promise<Object> {
    return await this.todosService.deleteTodo(id);
  }
}
