import { Post, Get, Res, Render, HttpCode, Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/messages')
  async Chat(@Res() res) {
    const messages = await this.chatService.getMessages();
    res.json(messages);
    return messages;
  }
  @Post('/conversation')
  async findConversation(@Body() data: any) {
    const messages = await this.chatService.findConversation(data);
    return messages;
  }
}
