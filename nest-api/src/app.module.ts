import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import {
  UsersRepository,
  Users,
  UsersController,
  UsersService,
} from './modules/users';
import {
  ChatGateway,
  ChatService,
  Chat,
  ChatRepository,
  ChatController,
} from './modules/chat';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([ChatRepository, Chat, UsersRepository, Users]),
  ],
  controllers: [ChatController, UsersController],
  providers: [ChatService, UsersService, ChatGateway],
})
export class AppModule {}
