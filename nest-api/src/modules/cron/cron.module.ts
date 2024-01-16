import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
