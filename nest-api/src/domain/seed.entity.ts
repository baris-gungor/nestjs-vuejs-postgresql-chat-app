import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DataSource,
} from 'typeorm';

@Entity()
export class Seed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ default: 1 })
  batch: number;

  @Column()
  md5: string;

  @CreateDateColumn({
    name: 'migration_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  migrationTime: Date;
}