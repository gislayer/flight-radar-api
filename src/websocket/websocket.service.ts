import { Injectable } from '@nestjs/common';
import { RouteGateway } from './gateways/route.gateway';
import { RouteUpdate, RouteLocation } from './interfaces/route.interface';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatMessage } from './interfaces/chat.interface';

@Injectable()
export class WebsocketService {
    constructor(
        private readonly routeGateway: RouteGateway,
        private readonly chatGateway: ChatGateway
      ) {}

  emitRouteUpdate(routeUpdate: RouteUpdate) {
    this.routeGateway.server.emit('routeUpdated', routeUpdate);
  }

  emitLocationUpdate(location: RouteLocation) {
    this.routeGateway.server.emit('locationUpdated', location);
  }

  sendDirectMessage(to: string, message: string, from: string) {
    this.chatGateway.server.to(to).emit('newMessage', {
      from,
      message,
      timestamp: new Date(),
    });
  }

  notifyUser(userId: string, event: string, data: any) {
    this.chatGateway.server.to(userId).emit(event, data);
  }
}