import { CategoryEnum } from 'src/enums/categories.enum';

export class CreateTodoDto {
  title: string;
  description: string;
  userID: string;
  category: CategoryEnum;
}

export class UpdateTodoDto {
  title: string;
  description: string;
  category: string;
}
