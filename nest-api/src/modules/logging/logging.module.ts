import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CronModule } from '../cron';
import { LoggingService } from './logging.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseLoggingInterceptor } from './response-logging.interceptor';
import { GlobalExceptionFilter } from './global-exception.filter';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    LoggingService,
    GlobalExceptionFilter,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseLoggingInterceptor,
    },
  ],
  exports: [LoggingService, GlobalExceptionFilter],
})
export class LoggingModule {}
