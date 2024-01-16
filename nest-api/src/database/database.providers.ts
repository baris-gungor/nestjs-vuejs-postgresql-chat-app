import { DataSource } from 'typeorm';

const dotenv = require('dotenv').config();

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: dotenv.parsed.DB_TYPE,
        host: dotenv.parsed.DB_HOST,
        port: Number(dotenv.parsed.DB_PORT),
        username: dotenv.parsed.DB_USER,
        password: dotenv.parsed.DB_PASS,
        database: dotenv.parsed.DB_NAME,
        // autoLoadEntities: true,
        synchronize: dotenv.parsed.DB_SYNC == true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      });
      return dataSource.initialize();
    },
  },
];
