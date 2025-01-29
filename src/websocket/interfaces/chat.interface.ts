export interface ChatMessage {
    id: string;
    from: string;
    to: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
  }
  
  export interface User {
    userId: string;
    role: 'admin' | 'pilot';
    socketId: string;
  }