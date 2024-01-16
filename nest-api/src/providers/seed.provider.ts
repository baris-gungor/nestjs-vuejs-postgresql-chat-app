import { DataSource } from "typeorm";
import { Seed } from "../domain";

export const seedProviders = [
  {
    provide: 'SEED_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Seed),
    inject: ['DATA_SOURCE'],
  },
];