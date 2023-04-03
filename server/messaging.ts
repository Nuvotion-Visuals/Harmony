import WebSocket from 'ws';
import { sendMessage } from './sendMessage';
import { WebsocketMessage } from 'types/MessagesTypes'

export const startMessagingServer = (port: number) => {
  const wss = new WebSocket.Server({ port });

  wss.on('connection', function connection(ws: WebSocket) {
    ws.on('message', (message: { data: string }) => {
      const action = JSON.parse(message.toString()) as WebsocketMessage;

      if (action.type === 'ping') {
        ws.send(
          JSON.stringify({
            type: 'pong',
            message: {},
            time: new Date().toLocaleTimeString([], {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            guid: action.guid,
            status: 200,
            messageTime: action.messageTime,
          })
        );
      }

      if (action.type === 'message') {
        console.log(action);
        sendMessage({
          conversationId: action.conversationId,
          parentMessageId: action.parentMessageId,
          personaLabel: action.personaLabel,
          systemMessage: action.systemMessage,
          userLabel: action.userLabel,
          message: action.message,
          onComplete: ({ response, parentMessageId, conversationId }) => {
            console.log('Sending response to client');
            ws.send(
              JSON.stringify({
                type:
                  action.personaLabel === 'GENERATE'
                    ? 'GENERATE_response'
                    : 'response',
                message: response || '',
                guid: action.guid,
                conversationId,
                parentMessageId,
                personaLabel: action.personaLabel,
                systemMessage: action.systemMessage,
                userLabel: action.userLabel,
                status: 200,
                messageTime: action.messageTime,
              })
            );
          },
          onProgress: ({ response, parentMessageId, conversationId, progress }) => {
            ws.send(
              JSON.stringify({
                type:
                  action.personaLabel === 'GENERATE'
                    ? 'GENERATE_partial-response'
                    : 'partial-response',
                message: response || '',
                guid: action.guid,
                conversationId,
                parentMessageId,
                personaLabel: action.personaLabel,
                systemMessage: action.systemMessage,
                userLabel: action.userLabel,
                status: 200,
                messageTime: action.messageTime,
                progress,
              })
            );
          },
        });
      }
    });
  });
}
