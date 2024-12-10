import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { v7 as uuid } from 'uuid';
import { Todo } from './Todo.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({
    nullable: false,
    length: 60,
  })
  fullname: string;

  @Column({
    nullable: false,
    unique: true,
    length: 120,
  })
  email: string;

  @Column({
    nullable: false,
    length: 255,
  })
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
