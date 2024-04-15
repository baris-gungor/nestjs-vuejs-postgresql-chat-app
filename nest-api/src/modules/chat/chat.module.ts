import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CronModule } from '../cron';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [DatabaseModule, CronModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
