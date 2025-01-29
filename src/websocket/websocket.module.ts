import { Module } from '@nestjs/common';
import { RouteGateway } from './gateways/route.gateway';
import { ChatGateway } from './gateways/chat.gateway';
import { WebsocketService } from './websocket.service';

@Module({
  providers: [
    RouteGateway,
    ChatGateway,  // ChatGateway'i providers'a ekledik
    WebsocketService
  ],
  exports: [WebsocketService],
})
export class WebsocketModule {}