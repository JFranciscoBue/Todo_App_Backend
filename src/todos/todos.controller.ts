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
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto } from 'src/dtos/Todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
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
  async addTodo(@Body() todo: CreateTodoDto): Promise<Object> {
    const response = await this.todosService.addTodo(todo);
    console.log(response);

    const { user, ...withOutUserData } = response;

    return {
      title: withOutUserData.title,
      description: withOutUserData.description,
      category: withOutUserData.category.name,
      isDone: withOutUserData.isDone,
    };
  }

  @Put('status/:id')
  @HttpCode(HttpStatus.OK)
  async updateStatus(@Param('id', ParseUUIDPipe) id: string): Promise<Object> {
    return await this.todosService.updateStatus(id);
  }

  @Put('update/category/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() categoryName: UpdateTodoDto,
  ): Promise<Object> {
    const { category } = categoryName;
    return await this.todosService.updateCategory(id, category);
  }

  @Put('update/:id')
  async updateTodo(
    @Body() updateTodo: UpdateTodoDto,
    @Param('id') id: string,
  ): Promise<Object> {
    return await this.todosService.updateTodo(updateTodo, id);
  }

  @Delete('delete/:id')
  async deleteTodo(@Param('id', ParseUUIDPipe) id: string): Promise<Object> {
    return await this.todosService.deleteTodo(id);
  }
}
