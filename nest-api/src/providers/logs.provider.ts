import { DataSource } from 'typeorm';
import { Logs } from '../domain';

export const logsProviders = [
  {
    provide: 'LOGS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Logs),
    inject: ['DATA_SOURCE'],
  },
];
