import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from 'src/entities/Todo.entity';
import { CreateTodoDto } from 'src/dtos/Todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get(':id')
  @HttpCode(200)
  async userTodos(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Todo[] | string> {
    const todos = await this.todosService.userTodos(id);

    console.log(todos);

    if (todos.length === 0) {
      return 'No tienes tarea pendientes';
    } else {
      return todos;
    }
  }

  @Post('add')
  async addTodo(@Body() todo: CreateTodoDto) {
    return await this.todosService.addTodo(todo);
  }
}
