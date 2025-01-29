export class SendMessageDto {
    adminId: number;
    message: {
      pilotId: number;
      message: string;
      timestamp: number;
    };
  }
  
  export class JoinChatDto {
    socketId: string;
    adminId: number;
    adminName: string;
    pilotId: number;
    name: string;
  }