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

@WebSocketGateway({
  namespace: 'chat',
  path: '',
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
    console.log('mesaj geldi', message);
    await this.chatService.sendMessage(message);
    this.server.emit('recMessage', message);
  }

  // public async newEvent(@MessageBody() data: any, @ConnectedSocket() client: Socket)
  @SubscribeMessage('newEvent')
  public async handleNewEvent(event: string, data: any) {
    this.server.emit('recMessage', data);
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
