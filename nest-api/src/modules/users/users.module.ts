import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../../database/database.module';
import { CronModule } from '../cron';
import { HttpModule } from '@nestjs/axios';
import { HttpConfigService } from 'src/config/http-config.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    DatabaseModule,
    CronModule,
    CacheModule.register(),
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
    ChatModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
