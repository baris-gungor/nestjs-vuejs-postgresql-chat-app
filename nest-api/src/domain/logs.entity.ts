import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Logs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'message', nullable: true })
  message: string;

  @Column({
    name: 'request_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  requestTime: Date;

  // @Column({ type: 'json', nullable: true })
  // request_body: string;

  @Column({ type: 'json', nullable: true })
  request: any;

  @Column({ type: 'json', nullable: true })
  response: string;

  @Column({ name: 'status_code', type: 'text', nullable: true })
  statusCode: string;

  @Column({ name: 'response_time', type: 'timestamp', nullable: true })
  responseTime: Date;

  @Column({ name: 'response_ms', nullable: true })
  responseMs: number;
}
