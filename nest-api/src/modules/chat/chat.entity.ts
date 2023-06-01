import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  text: string;

  @Column()
  sendTo: string;

  @CreateDateColumn()
  createdAt: Date;
}
