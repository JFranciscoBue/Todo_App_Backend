import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto, UpdateTodoDto } from 'src/dtos/Todo.dto';
import { Category } from 'src/entities/Category.entity';
import { Todo } from 'src/entities/Todo.entity';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import { validTodoDto } from '../utils/validateDto';

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

  async addTodo(todo: CreateTodoDto): Promise<Object> {
    if (validTodoDto(todo)) {
      const userFound = await this.usersRepository.findOne({
        where: { id: todo.userID },
      });

      if (!userFound) {
        throw new BadRequestException('El usuario no existe');
      }

      let cat: Category = await this.categoryRepository.findOne({
        where: { name: todo.category },
      });

      if (!cat) {
        cat = this.categoryRepository.create({ name: todo.category });
        await this.categoryRepository.save(cat);
      }
      const newTodo = this.todosRepository.create({
        ...todo,
        category: cat,
        user: userFound,
      });

      await this.todosRepository.save(newTodo);

      const { user, ...rest } = newTodo;

      return rest;
    } else {
      throw new BadRequestException('Complete todos los campos');
    }
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

  async deleteTodo(id: string): Promise<string> {
    const deleteResult = await this.todosRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new NotFoundException('La tarea no existe');
    }

    return 'Tarea eliminada exitosamente';
  }

  async updateCategory(id: string, categoryName: string): Promise<Object> {
    const todo = await this.todosRepository.findOne({
      where: { id },
      relations: { category: true },
    });

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

    const updatedTodo = this.todosRepository.findOne({
      where: { id },
    });

    return {
      success: 'Tarea Actualizada!',
      updatedTodo,
    };
  }
}
