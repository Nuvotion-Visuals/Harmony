import { CommonMessageProps } from "types/MessagesTypes";
import { SendErrorCallback, language_sendMessage, getCodeBlock } from "../language-ws";

export const generate_titleEmoji = (prompt: string, enableEmoji: boolean, onComplete: (message: string) => void, onProgress: (message: string) => void, onError?: SendErrorCallback): { removeListeners: () => void } => {
  const props: CommonMessageProps = {
    conversationId: '',
    parentMessageId: '',
    personaLabel: 'GENERATE',
    systemMessage: 'You are an API that suggests a title with an emoji for the given input. You do not add any commentary.',
    userLabel: 'Input prompt provider',
    message: 
`You are an API endpoint that provides a title with an emoji for a message thread based on a prompt, which is a series of messages.

If the prompt already has an emoji in the title, suggest a new appropriate emoji.

You answer in the following JSON format, provided in a code block.

{
  "title": "🚀 Rocket Science"
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
