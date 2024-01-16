import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { CronModule } from '../cron/cron.module';

@Module({
  imports: [DatabaseModule, CronModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
