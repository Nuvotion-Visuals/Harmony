import { v4 as uuidv4 } from 'uuid';
import { getWebsocketClient } from '../Connectvity/websocket-client';

export interface SendMessageProps {
  conversationId: string;
  parentMessageId?: string;
  personaLabel: string;
  systemMessage: string;
  userLabel: string;
  message: string;
}

export type SendMessageCallback = (response: SendMessageProps) => void;
export type SendErrorCallback = (error: any) => void;

export function language_sendMessage(
  props: SendMessageProps,
  onComplete: SendMessageCallback,
  onError?: SendErrorCallback,
  onPartialResponse?: SendMessageCallback
): { removeListeners: () => void } {
  const websocketClient = getWebsocketClient();

  const action = {
    type: "message",
    guid: uuidv4(),
    ...props,
  };
  websocketClient.send(JSON.stringify(action));

  // listen for data
  const messageHandler = (ev: MessageEvent) => {
    const wsmessage = JSON.parse(ev.data.toString());
    if (wsmessage.type === "pong") {
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

    if (type === "GENERATE_response") {
      const newMessage = {
        message,
        conversationId,
        parentMessageId,
        personaLabel,
        systemMessage,
        userLabel,
      } as SendMessageProps;

      onComplete(newMessage);
      removeListeners();
    } else if (type === "GENERATE_partial-response" && onPartialResponse) {
      const newMessage = {
        message,
        conversationId,
        parentMessageId,
        personaLabel,
        systemMessage,
        userLabel,
      } as SendMessageProps;

      onPartialResponse(newMessage);
    }
  };

  websocketClient.addEventListener("message", messageHandler);

  // listen for errors
  const errorHandler = (ev: Event) => {
    console.error(`Failed to send message: ${ev}`);
    if (onError) {
      onError(ev);
    }
    removeListeners();
  };

  websocketClient.addEventListener("error", errorHandler);

  const removeListeners = () => {
    websocketClient.removeEventListener("message", messageHandler);
    websocketClient.removeEventListener("error", errorHandler);
  };

  return { removeListeners };
}

function getCodeBlock(markdown: string): string | null {
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

export const language_generateGroups = (prompt: string, enableEmoji: boolean, onComplete: (message: string) => void, onProgress: (message: string) => void, onError?: SendErrorCallback, ): { removeListeners: () => void } => {
    const props: SendMessageProps = {
      conversationId: '12345',
      personaLabel: 'GENERATE',
      systemMessage: 'You provide a list of groups for the given input',
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
  
    return language_sendMessage(props, (response) => {
      const json = JSON.parse(JSON.stringify(getCodeBlock(response.message) || response.message));
      onComplete(json);
    }, onError, (progress) => {
        onProgress(progress.message)
    });
  };
  
export const language_generateTitleAndDescription = (prompt: string, enableEmoji: boolean, onComplete: (message: string) => void, onProgress: (message: string) => void, onError?: SendErrorCallback, ): { removeListeners: () => void } => {
    const props: SendMessageProps = {
      conversationId: '12345',
      personaLabel: 'GENERATE',
      systemMessage: 'You are an API that suggests a title for the given input. You do not add any commentary.',
      userLabel: 'Input prompt provider',
      message: 
`You are an API endpoint that provides a name and description for message thread based on a propmt, which is a series of messages.

The description should be a very short sentence, no more than just a few words.



${enableEmoji && 'The name starts with an emoji'}

You answer in the following JSON format, provided in a code block.

{
  "name": "Social media strategies",
  "description": "Craft a successful social media strategy to build your brand's online presence and drive engagement."
}

Prompt: ${prompt} Reply in JSON`,
    };
  
    return language_sendMessage(props, (response) => {
      const json = JSON.parse(JSON.stringify(getCodeBlock(response.message) || response.message));
      onComplete(json);
    }, onError, (progress) => {
        onProgress(progress.message)
    });
  };

export const language_generateThreadPrompts = (prompt: string, enableEmoji: boolean, onComplete: (message: string) => void, onProgress: (message: string) => void, onError?: SendErrorCallback, ): { removeListeners: () => void } => {
  const props: SendMessageProps = {
    conversationId: '12345',
    personaLabel: 'GENERATE',
    systemMessage: 'You are an API that provides a list of suggested threads for the given input. You do not add any commentary.',
    userLabel: 'Input prompt provider',
    message: 
`

You are an API endpoint that provides a list of four suggested messages for starting a new conversation thread. 

The four messages should be distinct naturally carrying on and advancing the conversation towards the desired goal or purpose of the channel.  The messages are intended to be answered by a language model.

Each message starts with an emoji and title. The titles should always be action-oriented present tense, and always a single capitalized word.

You answer in the following JSON format, provided in a code block.

{
  "suggestions": [
    "🤔 Critique: suggested message",
    "🗣️ Discuss: suggested message",
    "🔍 Explore: suggested message",
    "🎓 Teach: suggested message",
    "📚 Research: suggested message",
    "🎨 Create: suggested message"
  ]
}
Prompt: ${prompt} Reply in JSON`,
    };
  
    return language_sendMessage(props, (response) => {
      const json = JSON.parse(JSON.stringify(getCodeBlock(response.message) || response.message));
      onComplete(json);
    }, onError, (progress) => {
        onProgress(progress.message)
    });
  };

  export const language_generateFollowUpMessages = (prompt: string, enableEmoji: boolean, onComplete: (message: string) => void, onProgress: (message: string) => void, onError?: SendErrorCallback, ): { removeListeners: () => void } => {
    const props: SendMessageProps = {
      conversationId: '12345',
      personaLabel: 'GENERATE',
      systemMessage: 'You are an API that provides a list of follow up messages for the given input. You do not add any commentary. You always answer in a code block.',
      userLabel: 'Input prompt provider',
      message: 
  `You are an API endpoint that provides a list of four distinct suggestions for next messages within a conversation thread.

  The four messages should be distinct naturally carrying on and advancing the conversation towards the desired goal or purpose of the thread. The messages are intended to be answered by a language model.

  The messages should ALWAYS reference specific details, or at least specific themes from pervious messages.
    
  Each message starts with an emoji and title. The titles should always be action-oriented present tense, and always a single capitalized word.

  You answer in the following JSON format, provided in a markdown code block.
  
  {
    "suggestions": [
      "🤔 Critique: suggested message",
      "🗣️ Discuss: suggested message",
      "🔍 Explore: suggested message",
      "🎓 Teach: suggested message",
      "📚 Research: suggested message",
      "🎨 Create: suggested message"
    ]
  }
  
  Prompt: ${prompt} Reply in JSON`,
  };

    return language_sendMessage(props, (response) => {
      const json = JSON.parse(JSON.stringify(getCodeBlock(response.message) || response.message));
      onComplete(json);
    }, onError, (progress) => {
      onProgress(progress.message)
  });
};