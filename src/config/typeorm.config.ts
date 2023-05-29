import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Chat } from '../modules/chat';
import { Users } from '../modules/users';
require('dotenv').config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: process.env.DB_SYNC === 'true',
};
