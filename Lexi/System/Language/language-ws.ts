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
      chatGptLabel,
      promptPrefix,
      userLabel,
    } = JSON.parse(ev.data.toString());

    if (type === "GENERATE_response") {
      const newMessage = {
        message,
        conversationId,
        parentMessageId,
        chatGptLabel,
        promptPrefix,
        userLabel,
      } as SendMessageProps;

      onComplete(newMessage);
      removeListeners();
    } else if (type === "GENERATE_partial-response" && onPartialResponse) {
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

export const language_generateGroups = (prompt: string, enableEmoji: boolean, onComplete: (message: string) => void, onProgress: (message: string) => void, onError?: SendErrorCallback, ): { removeListeners: () => void } => {
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
      chatGptLabel: 'GENERATE',
      promptPrefix: 'You are an API that suggests a title for the given input. You do not add any commentary.',
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
    chatGptLabel: 'GENERATE',
    promptPrefix: 'You are an API that provides a list of suggested threads for the given input. You do not add any commentary.',
    userLabel: 'Input prompt provider',
    message: 
`You are an API in a project management app

You are an API endpoint that provides four suggestions for good starting prompts for threads of a channel in a project management app. 

The four prompts should be distinct, thought-provoking, and sure to lead to productive, rewarding progress. 

They should all focus on purpose the specified channel, if provided one. 

If there is only one provided existing thread, at least one of your suggestions should be of a distinct topic within the channel.

The titles should always be action-oriented present tense.

You answer in the following JSON format, provided in a code block.

{
  "suggestions": [
    "🎛️ Innovate: Brainstorm new and creative ways to combine analog and digital tools to create innovative audio reactive visuals.",
    "🤖 Automate: Research and explore ways to streamline and automate the integration process between analog and digital tools to create more efficient and effective audio reactive visuals.",
    "📈 Analyze: Use data from audio and visual sources to improve the accuracy and responsiveness of our audio reactive visuals. How can we use this information to optimize our work?",
    "🌐 Interact: Explore the use of digital tools to create interactive experiences that respond to audio inputs and user interactions. How can we make our audio reactive visuals more engaging?",
    "🎨 Optimize: Discuss how we can balance the aesthetics of analog and digital tools to optimize the visual quality of our audio reactive experiences. What techniques can we use to improve the overall visual impact?",
    "🎓 Learn: Attend conferences, seminars, and workshops to expand our knowledge and gain new perspectives on audio reactive visuals. How can we apply what we learn to our work?"
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
      chatGptLabel: 'GENERATE',
      promptPrefix: 'You are an API that provides a list of follow up messages for the given input. You do not add any commentary. You always answer in a code block.',
      userLabel: 'Input prompt provider',
      message: 
  `You are an API endpoint that provides a list of four distinct suggestions for follow-up message prompts within a thread of a project management app.

  The four prompts should be distinct, thought-provoking, and sure to lead to productive, rewarding progress. 
    
  They should stay on subject of the thread and be a natural continuation and progression of the thread's conversation. They should consider the context, goals, and progress of the existing messages.
    
  The titles should always be action-oriented present tense.

  You answer in the following JSON format, provided in a markdown code block.
  
  {
    "suggestions": [
      "🤔 Critique: Critically evaluate the current project plan. What are the strengths and weaknesses? How can we improve it to achieve better results?",
      "🗣️ Discuss: Engage in conversation about the project goals and expectations. How can we ensure that everyone is aligned and working towards the same objectives?",
      "🔍 Explore: Investigate different approaches to completing the project. How can we incorporate new ideas and techniques to make the project more innovative and effective?",
      "🎓 Teach: Share knowledge and expertise with each other to improve our collective skill set. What can we teach each other to enhance our performance?",
      "📚 Research: Conduct research on the best practices in our industry and see how we can apply them to our project. What are the trends and emerging technologies that we should be aware of?",
      "🎨 Create: Brainstorm creative solutions to the challenges we are facing in the project. How can we think outside the box to come up with original ideas and concepts?"
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