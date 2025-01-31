
export class TextMessageData {
  type: 'text';
  data: string;
}

export class CommandMessageData {
  type: 'command';
  data: {
    question: string;
    true_answer: string;
    false_answer: string;
  };
}

export class LocationMessageData {
  type: 'location';
  data: {
    type: 'target' | 'airport' | 'emergency' | 'searching';
    name : string;
    latitude: number;
    longitude: number;
  };
}

export class SendMessageDto {
  user_id: number;
  route_id: number;
  sender: string;
  message: {
    type: 'text' | 'command' | 'location';
    text?: TextMessageData;
    command?: CommandMessageData;
    location?: LocationMessageData;
    timestamp: number;
  };
}
  
  export class JoinChatDto {
    socketId: string;
    id: number;
    name: string;
    route_id: number;
  }