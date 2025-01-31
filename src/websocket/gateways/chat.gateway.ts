import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Logger } from '@nestjs/common';
  import { v4 as uuidv4 } from 'uuid';
  import { ChatMessage, User } from '../interfaces/chat.interface';
  import { SendMessageDto, JoinChatDto } from '../dto/chat.dto';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      transports: ['websocket', 'polling'],
    },
    namespace: '/chat',
    pingTimeout: 60000,
    pingInterval: 25000,
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor() {
        console.log('ChatGateway started');
        setInterval(() => {
            console.log('--- Current Status ---');
            console.log(`Connected User Counts: ${this.users.size}`);
            console.log('Connected Users:', Array.from(this.users.keys()));
            console.log('Created Routes:', Array.from(this.routes.keys()));
            console.log(`Messages Counts: ${this.messages.length}`);
            console.log('------------------------');
        }, 10000); // Her 10 saniyede bir durum raporu
    }

    @WebSocketServer()
    server: Server;
  
    private logger = new Logger('ChatGateway');
    private users: Map<number, {id:number, name:string, socketId:string, routes:number[]}> = new Map();
    private routes: Map<number, number[]> = new Map();
    private messages: SendMessageDto[] = [];
  
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log('Connection closed...');
      // Kullanıcıyı bağlı kullanıcılar listesinden çıkar
      for (const [id, item] of this.users.entries()) {
        if (item['socketId'] === client.id) {
          this.users.delete(id);
          console.log(`${item['name']} disconnected!`);
          break;
        }
      }
      this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('leave')
    handleLeaveChat(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: {socketId: string, route_id: number, user_id: number},
    ) {
      const user = this.users.get(data.user_id);
      if (user) {
        user.routes = user.routes.filter(route_id => route_id !== data.route_id);
        this.users.set(data.user_id, user);
        client.leave(`route_${data.route_id}`);
        console.log(`${user.name} successfully left from route ${data.route_id}`);
        client.emit('left', {
          route_id: data.route_id,
          user: {
            id: user.id,
            name: user.name,
            date: Date.now()
          }
        });
      } else {
        console.log(`User Not Found`);
      }
    }
  
    @SubscribeMessage('join')
    handleJoinChat(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: JoinChatDto,
    ) {
      console.log(`${data.name} User connected to ${data.route_id} - route`);

      var user = this.users.get(data.id);
      var userObj:any = {
        id: data.id,
        name: data.name,
        socketId: data.socketId,
        routes:[]
      };
      if(user){
        var routes:number[] = user.routes;
        if(!routes.includes(data.route_id)){ 
          client.join(`route_${data.route_id}`);
          routes.push(data.route_id);
        }
        user.routes = routes;
        this.users.set(data.id, user);
      }else{
        var routes:number[] = userObj.routes;
        if(!routes.includes(data.route_id)){ 
          client.join(`route_${data.route_id}`);
          routes.push(data.route_id);
        }
        userObj.routes = routes;
        this.users.set(data.id, userObj);
      }
      user = this.users.get(data.id);
      console.log(`${user?.name} joined to Route ID: ${data.route_id}`);
      var routeUsers:number[] = this.routes.get(data.route_id) ?? [];
      if(!routeUsers.includes(data.id)){
        routeUsers.push(data.id);
        this.routes.set(data.route_id, routeUsers);
      }
      client.emit('joined', {
        route_id: data.route_id,
        user: {
          id: user?.id,
          name: user?.name
        },
        route_users: routeUsers
      });
    }
  
    @SubscribeMessage('message')
    handleMessage(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: SendMessageDto,
    ) {
      console.log(`New ${data.message.type} message request from ${data.user_id} for route ${data.route_id}`);
      var user = this.users.get(data.user_id);
      if(!user) return;
      var routes = user?.routes;
      if(routes?.includes(data.route_id)){
        //client.emit('message', data);
        //this.server.to(`route_${data.route_id}`).emit('message', data);
        var routeUsers = this.routes.get(data.route_id);
        if(routeUsers){
        for(var user_id of routeUsers){
          var user = this.users.get(user_id);
          if(user){
            console.log(`Sending message to ${user.name}`);
            this.server.to(user.socketId).emit('message', data);
          }
        }
        this.messages.push(data);
        //this.server.to(`route_${data.route_id}`).emit('message', data);
      }
    }
  }
}