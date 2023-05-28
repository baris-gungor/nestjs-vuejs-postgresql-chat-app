import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Chat } from '../modules/chat';
import { Users } from '../modules/users';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'barisgungor',
  database: 'nest-chat',
  entities: [Chat, Users],
  synchronize: true,
};
