import { CommonMessageProps } from "types/MessagesTypes";
import { SendErrorCallback, language_sendMessage, getCodeBlock } from "../language-ws";

export const generate_titleAndDescription = (prompt: string, enableEmoji: boolean, onComplete: (message: string) => void, onProgress: (message: string) => void, onError?: SendErrorCallback, ): { removeListeners: () => void } => {
    const props: CommonMessageProps = {
      conversationId: '',
      parentMessageId: '',
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

If user feedback is provided it must be prioritized.

Prompt: ${prompt} Reply in JSON`,
    };
  
    return language_sendMessage(props, (response) => {
      const json = JSON.parse(JSON.stringify(getCodeBlock(response.message) || response.message));
      onComplete(json);
    }, onError, (progress) => {
        onProgress(progress.message)
    });
  };