import { v4 as uuidv4 } from 'uuid';
import { getWebsocketClient } from '../Connectvity/websocket-client';

export interface SendMessageProps {
  conversationId: string;
  parentMessageId?: string;
  chatGptLabel: string;
  promptPrefix: string;
  userLabel: string;
  message: string;
}

export type SendMessageCallback = (response: SendMessageProps) => void;
export type SendErrorCallback = (error: any) => void;

export function language_sendMessage(props: SendMessageProps, onComplete: SendMessageCallback, onError?: SendErrorCallback, onPartialResponse?: SendMessageCallback): void {
  const websocketClient = getWebsocketClient();

  const action = {
    type: 'message',
    guid: uuidv4(),
    ...props
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
      chatGptLabel,
      promptPrefix,
      userLabel,
    } = JSON.parse(ev.data.toString());

    if (type === 'GENERATE_response') {
      const newMessage = {
        message,
        conversationId,
        parentMessageId,
        chatGptLabel,
        promptPrefix,
        userLabel,
      } as SendMessageProps;

      onComplete(newMessage);
    } else if (type === 'GENERATE_partial-response' && onPartialResponse) {
      const newMessage = {
        message,
        conversationId,
        parentMessageId,
        chatGptLabel,
        promptPrefix,
        userLabel,
      } as SendMessageProps;

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
  };

  websocketClient.addEventListener('error', errorHandler);
}

function getCodeBlock(markdown: string): string | null {
    // Match a code block starting with three backticks and optional language identifier
    const codeBlockRegex = /^```(\S+)?\n([\s\S]+?)\n```$/gm;
  
    const matches = Array.from(markdown.matchAll(codeBlockRegex));
    if (matches.length > 0) {
      const match = matches[0];
      const code = match[2];
      return code;
    }
    return null;
  }

export const language_generateGroups = (prompt: string, enableEmoji: boolean, onComplete: (message: string) => void, onProgress: (message: string) => void, onError?: SendErrorCallback, ): void => {
    const props: SendMessageProps = {
      conversationId: '12345',
      chatGptLabel: 'GENERATE',
      promptPrefix: 'You provide a list of groups for the given input',
      userLabel: 'Input prompt provider',
      message: 
`You are an API endpoint that provides a list of Channels for a project management app based on a description.

You answer in the following JSON format, provided in a code block, and completing the TODOs. Your answer has 5 groups, with 4 channels each.

${enableEmoji && 'Each group and channel name starts with an emoji'}

{
"groups":[
    {
    "name":"${enableEmoji && '🚀 '}Projects",
    "description":"Manage projects.",
    "channels":[
        {
        "name":"${enableEmoji && '💬 '}general",
        "description":"General discussion about music projects."
        },
        // TODO: add 4 total channels
    ]
    },
    // TODO: add 4 groups, 
]
}

Description: ${prompt}`,
    };
  
    language_sendMessage(props, (response) => {
      const json = JSON.parse(JSON.stringify(getCodeBlock(response.message) || response.message));
      onComplete(json);
    }, onError, (progress) => {
        onProgress(progress.message)
    });
  };
  
export const language_test = (prompt: string, enableEmoji: boolean, onComplete: (message: string) => void, onProgress: (message: string) => void, onError?: SendErrorCallback, ): void => {
    const props: SendMessageProps = {
      conversationId: '12345',
      chatGptLabel: 'GENERATE',
      promptPrefix: 'You provide a list of titles for the given input',
      userLabel: 'Input prompt provider',
      message: 
`You are an API endpoint that provides a name and description for message thread based on a propmt, which is a series of messages.

The description should be a very short sentence, no more than just a few words.

You answer in the following JSON format, provided in a code block.

${enableEmoji && 'The name starts with an emoji'}

{
  "name": "Social media strategies",
  "description": "Craft a successful social media strategy to build your brand's online presence and drive engagement."
}

Prompt: ${prompt}`,
    };
  
    language_sendMessage(props, (response) => {
      const json = JSON.parse(JSON.stringify(getCodeBlock(response.message) || response.message));
      onComplete(json);
    }, onError, (progress) => {
        onProgress(progress.message)
    });
  };
  