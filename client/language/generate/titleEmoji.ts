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
`You are an API endpoint that adds (or replaces) an emoji to a title for a channel based on a prompt.

If the channel title already has an emoji, suggest a DIFFERENT appropriate emoji to replace the previous one.

** You MUST NOT change the title other than adding or replacing the emoji.

For example, "rocket science" should become "🚀 rocket science" and NOT something like "🚀 aerospace". Note that the emoji was added but the text was not changed.

If you can't come up with a good emoji because you are provided with a confusing title, choose a random emoji.

You answer in the following JSON format, provided in a code block.

{
  "title": "🚀 rocket science"
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
