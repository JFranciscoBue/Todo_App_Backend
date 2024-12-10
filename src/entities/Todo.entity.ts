import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v7 as uuid } from 'uuid';
import { User } from './User.entity';
import { Category } from './Category.entity';

@Entity({
  name: 'todos',
})
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({
    nullable: false,
    length: 20,
  })
  title: string;

  @Column({
    default: 'Descripcion',
    length: 100,
  })
  description: string;

  @Column({
    default: false,
  })
  isDone: boolean;

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Category, (category) => category.todos)
  @JoinColumn()
  category: Category;
}
