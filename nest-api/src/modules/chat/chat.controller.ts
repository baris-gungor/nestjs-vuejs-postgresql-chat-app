import { ChatDto } from '../../dtos';
import {
  Post,
  Get,
  Res,
  Render,
  HttpCode,
  Body,
  UseGuards,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiGuard } from '../../guards';
import { UsersDto } from '../../dtos/users.dto';
import { ChatService } from './chat.service';
import { ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('/chat')
@ApiHeader({
  name: 'auth',
  description:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2ODUwMjMsImV4cCI6MTcwMzY4ODYyM30.0f2e5j9DSWjdttKspU0pjCh_sBJaWzvp_KD1K6mIc5c',
  required: true,
})
@UseGuards(ApiGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  private readonly logger = new Logger(ChatController.name);

  @Get('/messages')
  async Chat() {
    const messages = await this.chatService.getMessages();
    return messages;
  }

  @Post('/conversation')
  async findConversation(@Body() data: any) {
    const messages = await this.chatService.findConversation(data);
    return messages;
  }

  @Post('/sendMessage')
  @ApiBody({
    type: ChatDto.SendMessage,
    description: 'User info required',
  })
  @UsePipes(new ValidationPipe())
  async sendMessage(@Body() data: ChatDto.SendMessage) {
    const messages = await this.chatService.sendMessage(data);
    return messages;
  }
}
