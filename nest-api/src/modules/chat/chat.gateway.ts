import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { Chat } from '../../domain';
import { Logger, UseGuards } from '@nestjs/common';
import { ApiGuard } from '../../guards';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
@WebSocketGateway({
  namespace: 'chat',
  // path: '/ws',
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private chatService: ChatService) {}
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, message: Chat) {
    await this.chatService.sendMessage(message);
    this.server.emit('recMessage', message);
  }

  afterInit(server: Server) {
    this.logger.debug(`afterInit: ${server}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.debug(`Connected: ${client.id}`);
  }
}
