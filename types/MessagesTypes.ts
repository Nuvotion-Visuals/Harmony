export interface CommonMessageProps {
  conversationId: string;
  parentMessageId: string;
  personaLabel: string;
  systemMessage: string;
  userLabel: string;
  message: string;
}

export interface SendMessageProps extends CommonMessageProps {
  threadId?: string;
  onComplete: (data: CommonMessageProps & { response: string }) => void;
  onProgress?: (data: CommonMessageProps & { response: string; progress: number }) => void;
}

export interface StoredMessage extends CommonMessageProps {
  response: string;
}

export interface MessagesByGuid {
  [guid: string]: StoredMessage[];
}

export interface StoredClient {
  api: any;
  personaLabel: string;
  systemMessage: string;
  userLabel: string;
}

export interface Clients {
  [key: string]: StoredClient;
}

export interface MessageGuids {
  [guid: string]: boolean;
}

export interface ThreadsByThreadId {
  [threadId: string]: string[]; // Array of GUIDs
}

export interface WebsocketMessage extends CommonMessageProps {
  type: string;
  guid: string;
  messageTime: string;
}