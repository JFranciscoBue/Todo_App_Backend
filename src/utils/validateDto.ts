import { CreateTodoDto } from 'src/dtos/Todo.dto';
import { CreateUserDto } from 'src/dtos/User.dto';

export const validUserDto = (userDto: CreateUserDto) => {
  const { email, fullname, password } = userDto;

  if (!email || !fullname || !password) {
    return false;
  } else {
    return true;
  }
};

export const validTodoDto = (todoDto: CreateTodoDto) => {
  const { title, userID, category } = todoDto;

  if (!title || !userID || !category) {
    return false;
  }

  return true;
};
