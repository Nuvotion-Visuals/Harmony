export interface BaseLabels {
  personaLabel: string;
  systemMessage: string;
  userLabel: string;
}

export interface CommonMessageProps extends BaseLabels {
  conversationId: string;
  parentMessageId: string;
  message: string;
}

export interface SendMessageProps extends CommonMessageProps {
  onComplete: (data: CommonMessageProps & { response: string }) => void;
  onProgress?: (data: CommonMessageProps & { response: string; progress: number }) => void;
}

export interface StoredClient extends BaseLabels {
  api: any;
}

export interface Clients {
  [key: string]: StoredClient;
}

export interface WebsocketMessage extends CommonMessageProps {
  type: string;
  guid: string;
  messageTime: string;
}
