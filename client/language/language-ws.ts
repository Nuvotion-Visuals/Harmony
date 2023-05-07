import { generateUUID } from '@avsync.live/formation';
import { getWebsocketClient } from 'client/connectivity/websocket-client';

import { CommonMessageProps } from 'types/MessagesTypes';

export type SendMessageCallback = (response: CommonMessageProps) => void;
export type SendErrorCallback = (error: any) => void;

export function language_sendMessage(
  props: CommonMessageProps,
  onComplete: SendMessageCallback,
  onError?: SendErrorCallback,
  onPartialResponse?: SendMessageCallback
): { removeListeners: () => void } {
  const websocketClient = getWebsocketClient();

  const action = {
    type: 'message',
    guid: generateUUID(),
    ...props,
  };
  websocketClient.send(JSON.stringify(action));

  // listen for data
  const messageHandler = (ev: MessageEvent) => {
    const wsmessage = JSON.parse(ev.data.toString());
    if (wsmessage.type === 'pong') {
      // console.log(wsmessage)
    }

    const {
      guid,
      message,
      type,
      conversationId,
      parentMessageId,
      personaLabel,
      systemMessage,
      userLabel,
    } = JSON.parse(ev.data.toString());

    if (type === 'GENERATE_response') {
      const newMessage = {
        message,
        conversationId,
        parentMessageId,
        personaLabel,
        systemMessage,
        userLabel,
      } as CommonMessageProps;

      onComplete(newMessage);
      removeListeners();
    } else if (type === 'GENERATE_partial-response' && onPartialResponse) {
      const newMessage = {
        message,
        conversationId,
        parentMessageId,
        personaLabel,
        systemMessage,
        userLabel,
      } as CommonMessageProps;

      onPartialResponse(newMessage);
    }
  };

  websocketClient.addEventListener('message', messageHandler);

  // listen for errors
  const errorHandler = (ev: Event) => {
    console.error(`Failed to send message: ${ev}`);
    if (onError) {
      onError(ev);
    }
    removeListeners();
  };

  websocketClient.addEventListener('error', errorHandler);

  const removeListeners = () => {
    websocketClient.removeEventListener('message', messageHandler);
    websocketClient.removeEventListener('error', errorHandler);
  };

  return { removeListeners };
}

export function getCodeBlock(markdown: string): string | null {
  // Match a code block starting with four backticks and optional language identifier
  const codeBlockRegex = /^```(\S+)?\n([\s\S]+?)\n```$/gm;

  const matches = Array.from(markdown.matchAll(codeBlockRegex));
  if (matches.length > 0) {
    const match = matches[0];
    const code = match[2];
    return code;
  }
  return null;
}
