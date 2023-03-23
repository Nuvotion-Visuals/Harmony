export interface SendMessageProps {
  conversationId: string;
  parentMessageId?: string;
  personaLabel: string;
  systemMessage: string;
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
    personaLabel: 'GENERATOR',
    systemMessage: 'You provide a list of groups for the given input',
    userLabel: 'Input prompt provider',
    message: 
`You are an API endpoint that provides a list of Channels for a project management app based on a description.

You answer in the following JSON format, provided in a code block, and completing the TODOs. Your answer has 6 or more groups, with 4 or more channels each. This should be a very comprehensive extended list.

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
        // TODO: add 4 or more channels
      ]
    },
    // TODO: add 6 or more groups, 
  ]
}

Description: ${prompt}`,
    threadId: '67890',
  };

  language_sendMessage(props, (response: any) => {
    const json = JSON.parse(JSON.stringify(getCodeBlock(response.response) || response.response))
    console.log(json)
    // @ts-ignore
    onComplete(getCodeBlock(json));
  }, onError);
}



