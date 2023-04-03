import { generateUUID } from '@avsync.live/formation';
import { dynamicImport } from 'tsimportlib';
import type {
    SendMessageProps,
    StoredMessage,
    MessagesByGuid,
    Clients,
    MessageGuids,
    ThreadsByThreadId,
  } from '../types/MessagesTypes';
  
const messagesByGuid: MessagesByGuid = {};
const clients: Clients = {};
const messageGuids: MessageGuids = {};
const threadsByThreadId: ThreadsByThreadId = {};

export const sendMessage = async ({
  conversationId,
  parentMessageId,
  personaLabel,
  systemMessage,
  userLabel,
  message,
  threadId,
  onComplete,
  onProgress,
}: SendMessageProps) => {
  const guid = generateUUID();
  messageGuids[guid] = true;

  let storedClient = clients[`${systemMessage}-${personaLabel}-${userLabel}`];

  if (!storedClient) {
    // Dynamically import the ChatGPTAPI
    const { ChatGPTAPI } = await dynamicImport('chatgpt', module) as typeof import('chatgpt');
    const api = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

    storedClient = {
      api,
      personaLabel,
      systemMessage,
      userLabel,
    };
    clients[`${systemMessage}-${personaLabel}-${userLabel}`] = storedClient;
  }

  const onCompleteWrapper = (data: StoredMessage) => {
    if (!messagesByGuid[guid]) {
      messagesByGuid[guid] = [];
    }
    messagesByGuid[guid].push(data);

    if (threadId) {
      if (!threadsByThreadId[threadId]) {
        threadsByThreadId[threadId] = [];
      }
      threadsByThreadId[threadId].push(guid);
    }

    onComplete(data);
  };

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

  const res = await storedClient.api.sendMessage(`${message}`, {
    systemMessage,
    parentMessageId,
    onProgress: onProgressWrapper,
  });

  onCompleteWrapper({
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