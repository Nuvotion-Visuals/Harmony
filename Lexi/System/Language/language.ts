import { getWebsocketClient } from "../Connectvity/websocket-client";

interface SendMessageProps {
  conversationId: string;
  parentMessageId?: string;
  chatGptLabel: string;
  promptPrefix: string;
  userLabel: string;
  message: string;
  threadId: string;
}

type SendMessageCallback = (response: SendMessageProps) => void;
type SendErrorCallback = (error: any) => void;

function language_sendMessage(props: SendMessageProps, onComplete: SendMessageCallback, onError?: SendErrorCallback): void {
  const websocketClient = getWebsocketClient()
  const action = {
    type: 'message',
    guid: Math.random().toString(36).substring(7),
    conversationId: props.conversationId,
    parentMessageId: props.parentMessageId,
    chatGptLabel: props.chatGptLabel,
    promptPrefix: props.promptPrefix,
    userLabel: props.userLabel,
    message: props.message,
    threadGuid: props.threadId,
  };
  websocketClient.send(JSON.stringify(action));

  const handleResponse = (event: MessageEvent) => {
    const data = JSON.parse(event.data) as SendMessageProps;
    if (data.guid === action.guid) {
      onComplete(data);
      websocketClient.removeEventListener('message', handleResponse);
    }
  };

  websocketClient.addEventListener('message', handleResponse);

  if (onError) {
    websocketClient.addEventListener('error', onError);
  }
}

function getCodeBlock(markdown: string): string | null {
  const codeBlockRegex = /^```(\S+)?\n([\s\S]+?)\n```$/gm;

  const matches = Array.from(markdown.matchAll(codeBlockRegex));
  if (matches.length > 0) {
    const match = matches[0];
    const code = match[2];
    return code;
  }
  return null;
}

export const language_generateGroups = (prompt: string, enableEmoji: boolean, onComplete: (message: string) => void, onError?: SendErrorCallback): void => {
  const props: SendMessageProps = {
    conversationId: '12345',
    chatGptLabel: 'GENERATE',
    promptPrefix: 'You provide a list of groups for the given input',
    userLabel: 'Input prompt provider',
    message:
`You are an API endpoint that provides a list of Channels for a project management app based on a description.

You answer in the following JSON format, provided in a code block, and completing the TODOs. You should have at least 5 groups, which at least 3 channels each.

${enableEmoji && 'Each group and channel name starts with an emoji'}

{
  "groups":[
    {
      "groupName":"${enableEmoji && '🚀 '}Projects",
      "groupDescription":"Manage projects.",
      "channels":[
        {
          "channelName":"${enableEmoji && '💬 '}general",
          "channelDescription":"General discussion about music projects."
        },
        // TODO: add the rest of the channels
      ]
    },
    // TODO: add the rest of the channels
  ]
}

Description: ${prompt}`,
    threadId: '67890',
  };

  language_sendMessage(props, (response) => {
    const json = JSON.parse(JSON.stringify(getCodeBlock(response.message) || response.message))
    console.log(json)
    // @ts-ignore
    onComplete(getCodeBlock(json));
  }, onError);
}
