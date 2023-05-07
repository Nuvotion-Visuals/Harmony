import { CommonMessageProps } from "types/MessagesTypes";
import { SendErrorCallback, language_sendMessage, getCodeBlock } from "../language-ws";

export const generate_searchQueries = (
    prompt: string, enableEmoji: boolean, onComplete: (message: string) => void, onProgress: (message: string) => void, onError?: SendErrorCallback, 
  ): { removeListeners: () => void } => {
    const props: CommonMessageProps = {
      conversationId: '',
      parentMessageId: '',
      personaLabel: 'GENERATE',
      systemMessage:
        'You are an API that suggests search queries based on a given prompt. You do not add any commentary. You always answer in a code block.',
      userLabel: 'Search query provider',
      message: `You are an AI language model, and your task is to provide four unique, high-quality, and relevant search query suggestions based on a given prompt. Each search query should begin with a keyword or phrase representing the main topic, followed by more specific search terms.
      
      If no prompt is provided, you suggest a list of productive searches that a creative professional might need.
  
      If a search query is provided, prioritize that subject in relation to the search.
  
      You answer in the following JSON format, provided in a markdown code block.
      
      {
        "suggestions": [
          "best ways to *",
          "* examples",
          "how to *",
          "tools for *",
          "advanced * techniques",
          "expert advice on *",
          "top resources for *"
        ]
      }
  
      * is the topic of the search

      If user feedback is provided it must be prioritized.
      
      Prompt: ${prompt} Reply in JSON, in a CODE BLOCK!`,
    };
  
    return language_sendMessage(props, (response) => {
      const json = JSON.parse(JSON.stringify(getCodeBlock(response.message) || response.message));
      onComplete(json.queries);
    }, onError, (progress) => {
      onProgress(progress.message);
    });
  };