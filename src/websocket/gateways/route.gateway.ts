import { 
    WebSocketGateway, 
    WebSocketServer,
    SubscribeMessage, 
    OnGatewayConnection,
    OnGatewayDisconnect 
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Logger } from '@nestjs/common';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
    namespace: '/socket/routes'
  })
  export class RouteGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(RouteGateway.name);
    
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`); 
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('routeUpdate')
    handleRouteUpdate(client: Socket, payload: any) {
      this.server.emit('routeUpdated', payload);
    }
  
    @SubscribeMessage('locationUpdate')
    handleLocationUpdate(client: Socket, payload: any) {
      this.server.emit('locationUpdated', payload);
    }
  }