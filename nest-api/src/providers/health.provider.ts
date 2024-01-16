import { DataSource } from 'typeorm';
import { Health } from '../domain';

export const healthProviders = [
  {
    provide: 'HEALTH_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Health),
    inject: ['DATA_SOURCE'],
  },
];
