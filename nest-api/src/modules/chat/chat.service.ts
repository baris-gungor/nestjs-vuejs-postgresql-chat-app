import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
  ) {}

  async createMessage(chat: Chat): Promise<Chat> {
    return await this.chatRepository.save(chat);
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
  // async updateTodo(idv, todoData) {
  //   try {
  //     const firstUser = await this.todoRepository.findOneBy(idv);
  //     return await this.todoRepository
  //       .createQueryBuilder()
  //       .update(Todo)
  //       .set({
  //         job: todoData.job,
  //         description: todoData.description,
  //       })
  //       .where('id = :id', { id: firstUser.id })
  //       .execute();
  //   } catch (err) {
  //     return `updateTodo hata: ${err}`;
  //   }
  // }
}
