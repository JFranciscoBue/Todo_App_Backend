import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'node:console';
import { todo } from 'node:test';
import { CreateTodoDto, UpdateTodoDto } from 'src/dtos/Todo.dto';
import { Category } from 'src/entities/Category.entity';
import { Todo } from 'src/entities/Todo.entity';
import { User } from 'src/entities/User.entity';
import { CategoryEnum } from 'src/enums/categories.enum';
import { Repository } from 'typeorm';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Todo) private todosRepository: Repository<Todo>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async userTodos(id: string): Promise<Todo[]> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { todos: true },
    });

    if (!user) {
      throw new BadRequestException('El usuario no existe');
    }

    const todos = await this.todosRepository.find({
      where: { user },
      relations: ['category'],
    });

    console.log(todos);

    return todos;
  }

  async addTodo(todo: CreateTodoDto): Promise<Todo> {
    const { title, description, category, userID } = todo;
    const user = await this.usersRepository.findOne({ where: { id: userID } });
    console.log(user);

    console.log(user.id);

    if (!user) {
      throw new BadRequestException('El usuario no existe');
    }

    const cat: Category = this.categoryRepository.create({
      name: category,
    });

    await this.categoryRepository.save(cat);

    const newTodo = this.todosRepository.create({
      title,
      description,
      category: cat,
      user,
    });

    console.log(newTodo);

    await this.todosRepository.save(newTodo);

    return newTodo;
  }

  async updateStatus(id: string): Promise<Object> {
    const todo = await this.todosRepository.findOne({ where: { id } });

    if (!todo) {
      throw new NotFoundException('La tarea no existe');
    }

    if (todo.isDone) {
      throw new BadRequestException('La tarea ya se encuentra Completada');
    }

    const updatedResult = await this.todosRepository.update(todo.id, {
      isDone: true,
    });

    return {
      success: 'La tarea fue completada',
      updatedResult,
    };
  }

  async deleteTodo(id: string): Promise<Object> {
    const deleteResult = await this.todosRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new NotFoundException('La tarea no existe');
    }

    return {
      success: 'Tarea eliminada exitosamente',
      deleteResult,
    };
  }

  async updateCategory(id: string, categoryName: string): Promise<Object> {
    const todo = await this.todosRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    console.log(todo);
    console.log(todo.category.id);

    if (!todo) {
      throw new NotFoundException('La tarea no existe');
    }

    const newCat = this.categoryRepository.create({
      name: categoryName,
    });

    await this.categoryRepository.save(newCat);

    const updatedResult = await this.todosRepository.update(todo.id, {
      category: newCat,
    });

    if (updatedResult.affected === 0) {
      throw new Error('No se ha podido cambiar la categoria en este momento');
    }

    const categoryDeleteResult = await this.categoryRepository.delete(
      todo.category.id,
    );

    if (categoryDeleteResult.affected === 0) {
      throw new Error(
        'Ha habido un error en el servidor. Intenta de nuevo mas tarde',
      );
    }

    return {
      succes: 'Categoria cambiada correctamente',
      updatedResult,
    };
  }

  async updateTodo(updateTodo: UpdateTodoDto, id: string): Promise<Object> {
    const todo = await this.todosRepository.findOne({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException('La tarea no existe');
    }

    const updatedResult = await this.todosRepository.update(todo.id, {
      title: updateTodo.title,
      description: updateTodo.description,
    });

    if (updatedResult.affected === 0) {
      throw new Error(
        'No se ha podido actualizar la tarea. Intentalo mas Tarde',
      );
    }

    return {
      success: 'Tarea Actualizada!',
      updatedResult,
    };
  }
}
