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
        console.log('ChatGateway başlatıldı');
        setInterval(() => {
            console.log('--- Mevcut Durum Raporu ---');
            console.log(`Connected Admin Counts: ${this.admin.size}`);
            console.log('Connected Admins:', Array.from(this.admin.keys()));
            console.log(`Messages Counts: ${this.messages.length}`);
            console.log('------------------------');
        }, 10000); // Her 10 saniyede bir durum raporu
    }

    @WebSocketServer()
    server: Server;
  
    private logger = new Logger('ChatGateway');
    private admin: Map<number, {id:number, name:string, socketId:string, rooms:string[]}> = new Map();
    private pilots: Map<number, object> = new Map();
    private messages: ChatMessage[] = [];
  
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log('Connection closed...');
      // Kullanıcıyı bağlı kullanıcılar listesinden çıkar
      for (const [id, item] of this.admin.entries()) {
        if (item['socketId'] === client.id) {
          this.admin.delete(id);
          console.log(`${item['name']} disconnected!`);
          break;
        }
      }
      this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('leave')
    handleLeaveChat(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: {socketId: string, pilotId: number, adminId: number},
    ) {
      console.log(`Admin with ID ${data.adminId} is leaving pilot room with ID ${data.pilotId}`);

      const admin = this.admin.get(data.adminId);
      
      if (admin) {
        // Admin'in odalar listesinden pilotId'yi kaldır
        admin.rooms = admin.rooms.filter(room => room !== data.pilotId.toString());
        this.admin.set(data.adminId, admin);
        
        // Socket'i odadan çıkar
        client.leave(data.pilotId.toString());
        
        console.log(`${admin.name} successfully left room ${data.pilotId}`);
        client.emit('left', {
          room: data.pilotId.toString(),
          admin: {
            id: admin.id,
            name: admin.name
          }
        });
      } else {
        console.log(`${data.adminId} Admin Not Found`);
      }
    }
  
    @SubscribeMessage('join')
    handleJoinChat(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: JoinChatDto,
    ) {
      console.log(`${data.adminName} user connected to ${data.pilotId}-${data.name} - pilot`);

      var admin = this.admin.get(data.adminId);
      var adminObject:any = {
        id: data.adminId,
        name: data.adminName,
        socketId: data.socketId,
        rooms:[]
      }

      if(admin){
        var rooms:string[] = admin.rooms;
        if(!rooms.includes(data.pilotId.toString())){ 
          client.join(data.pilotId.toString());
          rooms.push(data.pilotId.toString());
        }
        admin.rooms = rooms;
        this.admin.set(data.adminId, admin);
      }else{
        var rooms:string[] = adminObject.rooms;
        if(!rooms.includes(data.pilotId.toString())){ 
          client.join(data.pilotId.toString());
          rooms.push(data.pilotId.toString());
        }
        adminObject.rooms = rooms;
        this.admin.set(data.adminId, adminObject);
      }

      admin = this.admin.get(data.adminId);

      
      console.log(`Created special room for ${admin?.name} and ${data.name} pilot, Room ID: ${data.pilotId}`);
      client.emit('joined', {
        room: data.pilotId.toString(),
        admin: {
          id: admin?.id,
          name: admin?.name
        },
        pilot: {
          id: data.pilotId,
          name: data.name
        }
      });
    }
  
    @SubscribeMessage('message')
    handleMessage(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: SendMessageDto,
    ) {
      console.log('Yeni mesaj gönderme isteği alındı');
      
      var admin = this.admin.get(data.adminId);
      var rooms = admin?.rooms;
      if(rooms?.includes(data.message.pilotId.toString())){
        const message: ChatMessage = {
          id: uuidv4(),
          from: admin?.id.toString() ?? '',
          to: data.message.pilotId.toString(),
          message: data.message.message,
          timestamp: new Date(),
          isRead: false,
        };
        client.emit('message', data.message);
        this.messages.push(message);
        this.server.to(message.to).emit('message', message);
        console.log(`New message sent to ${message.to}`);
      }
    }
  }