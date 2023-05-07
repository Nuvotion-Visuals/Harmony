import { CommonMessageProps } from "types/MessagesTypes";
import { SendErrorCallback, getCodeBlock, language_sendMessage } from "../language-ws";

export const generate_threadPrompts = (prompt: string, enableEmoji: boolean, onComplete: (message: string) => void, onProgress: (message: string) => void, onError?: SendErrorCallback, ): { removeListeners: () => void } => {
    const props: CommonMessageProps = {
      conversationId: '',
      parentMessageId: '',
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
  