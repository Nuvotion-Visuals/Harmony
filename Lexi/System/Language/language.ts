export interface SendMessageProps {
  conversationId: string;
  parentMessageId?: string;
  chatGptLabel: string;
  promptPrefix: string;
  userLabel: string;
  message: string;
  threadId: string;
}

export type SendMessageCallback = (response: SendMessageProps) => void;
export type SendErrorCallback = (error: any) => void;

export function language_sendMessage(props: SendMessageProps, onComplete: SendMessageCallback, onError?: SendErrorCallback): void {
  const queryParams = Object.fromEntries(Object.entries(props).map(([key, value]) => [key, value.toString()]));

  fetch(`/send-message?${new URLSearchParams(queryParams).toString()}`)
    .then((res) => res.json())
    .then((data) => {
      onComplete(data);
    })
    .catch((err) => {
      console.error(`Failed to send message: ${err}`);
      if (onError) {
        onError(err);
      }
    });
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

export const language_generateGroups = (prompt: string, enableEmoji: boolean, onComplete: (message: string) => void, onError?: SendErrorCallback): void => {
  const props: SendMessageProps = {
    conversationId: '12345',
    chatGptLabel: 'Group generator',
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
    const json = JSON.parse(JSON.stringify(getCodeBlock(response.response) || response.response))
    console.log(json)
    // @ts-ignore
    onComplete(getCodeBlock(json));
  }, onError);
}
