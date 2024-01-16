import {
  Inject,
  Injectable,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Chat } from '../../domain';
import { ChatDto } from '../../dtos/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_REPOSITORY') private chatRepository: Repository<Chat>,
  ) {}
  private validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
  });
  private readonly logger = new Logger(ChatService.name);

  async sendMessage(chat: Chat) {
    try {
      const validatedData = await this.validationPipe.transform(chat, {
        metatype: ChatDto.SendMessage,
      } as any);
      return await this.chatRepository.save(validatedData);
    } catch (error) {
      this.logger.error(
        `Websocket message dto failed. Check your message body.`,
      );
    }
  }

  async getMessages(): Promise<Chat[]> {
    return await this.chatRepository.find();
  }
  async findConversation(data: any) {
    try {
      const res = await this.chatRepository
        .createQueryBuilder()
        .select('chat')
        .from(Chat, 'chat')
        .where('chat.username = :username AND chat.sendTo = :sendTo', {
          username: data.username,
          sendTo: data.sendTo,
        })
        .getMany();
      const res2 = await this.chatRepository
        .createQueryBuilder()
        .select('chat')
        .from(Chat, 'chat')
        .where('chat.username = :username AND chat.sendTo = :sendTo', {
          username: data.sendTo,
          sendTo: data.username,
        })
        .getMany();
      res2.forEach((el) => {
        res.push(el);
      });
      res.sort(function (a, b) {
        return a.id - b.id;
      });
      return res;
    } catch (err) {
      let error = `findConversation hata: ${err}`;
      console.log(error);
      return error;
    }
  }
}
