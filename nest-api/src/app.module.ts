import { DatabaseModule } from './database/database.module';
import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CronModule, HealthModule, UsersModule } from './modules';
import { ChatModule } from './modules/chat/chat.module';
import { LoggingModule } from './modules/logging/logging.module';

@Module({
  imports: [
    HealthModule,
    DatabaseModule,
    CronModule,
    UsersModule,
    ChatModule,
    LoggingModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppModule.name);
  async onModuleInit() {
    try {
      await this.appService.seedDB();
    } catch (error) {
      this.logger.error('AppModule Seed Proccess gives an error:', error);
    }
  }
}
