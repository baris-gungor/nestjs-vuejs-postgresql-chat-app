import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import * as allProviders from '../providers';

function getAllProviders() {
  const data = { ...allProviders, databaseProviders };
  const models = [];
  for (let value of Object.values(data)) {
    models.push(...value);
  }
  return models;
}

@Module({
  providers: [...getAllProviders()],
  exports: [...getAllProviders()],
})
export class DatabaseModule {}
