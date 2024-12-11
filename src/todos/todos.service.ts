import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from 'src/dtos/Todo.dto';
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
      relations: ['user', 'category'],
    });

    console.log(todos);

    return todos;
  }

  async addTodo(todo: CreateTodoDto) {
    const { title, description, category, userID } = todo;
    const user = await this.usersRepository.findOne({ where: { id: userID } });
    console.log(user);

    console.log(user.id);

    if (!user) {
      throw new BadRequestException('El usuario no existe');
    }

    const cat: Category = this.categoryRepository.create({
      name: CategoryEnum.SOCIAL,
    });

    await this.categoryRepository.save(cat);

    const newTodo = {
      title,
      description,
      cat,
      user,
    };

    await this.todosRepository.save(newTodo);
  }
}
