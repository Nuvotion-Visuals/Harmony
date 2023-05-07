import { CommonMessageProps } from "types/MessagesTypes";
import { SendErrorCallback, language_sendMessage, getCodeBlock } from "../language-ws";

export const generate_followUpMessages = (prompt: string, enableEmoji: boolean, onComplete: (message: string) => void, onProgress: (message: string) => void, onError?: SendErrorCallback, ): { removeListeners: () => void } => {
    const props: CommonMessageProps = {
      conversationId: '',
      parentMessageId: '',
      personaLabel: 'GENERATE',
      systemMessage: 'You are an API that provides a list of follow up messages for the given input. You do not add any commentary. You always answer in a code block.',
      userLabel: 'Input prompt provider',
      message: 
  `You are an AI language model, and your task is to provide four unique and engaging suggestions for advancing a conversation thread. Each suggestion should reference specific details or themes from previous messages and be presented in a JSON format.

  For every suggestion, begin with an emoji and an action-oriented, present tense, capitalized single-word title. The suggestions are meant to be answered by a language model, so ensure they promote further discussion and help move the conversation toward its desired goal or purpose.

  You answer in the following JSON format, provided in a markdown code block.
  
  {
    "suggestions": [
      "🤔 Critique: How effective have noise-cancelling headphones been for employees dealing with distractions in open-plan offices?",
      "🗣️ Discuss: What measures have other companies implemented to reduce noise levels and distractions in open-plan workspaces?",
      "🔍 Explore: Are there any studies or reports that highlight the pros and cons of open-plan office layouts in terms of productivity?",
      "🎓 Teach: Could you explain the concept of 'activity-based working' and how it might improve productivity in an open-plan office?"
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

