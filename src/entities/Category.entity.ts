import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { v7 as uuid } from 'uuid';
import { Todo } from './Todo.entity';

@Entity({
  name: 'categories',
})
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({
    nullable: false,
  })
  name: string;

  @OneToMany(() => Todo, (todo) => todo.category)
  todos: Todo[];
}
