import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { v7 as uuid } from 'uuid';
import { CategoryEnum } from '../enums/categories.enum';
import { Todo } from './Todo.entity';

@Entity({
  name: 'categories',
})
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({
    nullable: false,
    enum: CategoryEnum,
  })
  name: string;

  @OneToMany(() => Todo, (todo) => todo.category)
  todos: Todo[];
}
