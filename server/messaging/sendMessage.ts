import { generateUUID } from '@avsync.live/formation';
import { dynamicImport } from 'tsimportlib';
import type {
    SendMessageProps,
    Clients,
  } from 'types/MessagesTypes';
  
const clients: Clients = {};

export const sendMessage = async ({
  conversationId,
  parentMessageId,
  personaLabel,
  systemMessage,
  userLabel,
  message,
  onComplete,
  onProgress,
}: SendMessageProps) => {
  const guid = generateUUID();

  let storedClient = clients[`${systemMessage}-${personaLabel}-${userLabel}`];

  if (!storedClient) {
    // Dynamically import the ChatGPTAPI
    const { ChatGPTAPI } = await dynamicImport('chatgpt', module) as typeof import('chatgpt');
    const api = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY || '',
      completionParams: {
        model: 'gpt-3.5-turbo-16k',
        temperature: 0.8,
        top_p: 0.95
      }
    })

    storedClient = {
      api,
      personaLabel,
      systemMessage,
      userLabel,
    };
    clients[`${systemMessage}-${personaLabel}-${userLabel}`] = storedClient;
  }

  const onProgressWrapper = (partialResponse: any) => {
    if (onProgress) {
      onProgress({
        conversationId,
        parentMessageId,
        personaLabel,
        systemMessage,
        userLabel,
        message,
        response: partialResponse.text,
        progress: partialResponse.progress,
      });
    }
  };

  const maxLength = 4096;
  const period = ".";

  let messageToSend = message;

  if (message.length > maxLength) {
    messageToSend = message.slice(0, maxLength - period.length) + period;
  }

  const res = await storedClient.api.sendMessage(messageToSend, {
    systemMessage,
    parentMessageId,
    onProgress: onProgressWrapper,
  });

  onComplete({
    conversationId,
    parentMessageId: res.id,
    personaLabel,
    systemMessage,
    userLabel,
    message,
    response: res.text,
  });

  return guid;
};
