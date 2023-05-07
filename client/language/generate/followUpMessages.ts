import { CommonMessageProps } from "types/MessagesTypes";
import { SendErrorCallback, language_sendMessage, getCodeBlock } from "../language-ws";

export const generate_followUpMessages = (
  prompt: string,
  enableEmoji: boolean,
  onComplete: (message: string) => void,
  onProgress: (message: string) => void,
  onError?: SendErrorCallback,
): { removeListeners: () => void } => {
  const props: CommonMessageProps = {
    conversationId: '',
    parentMessageId: '',
    personaLabel: 'GENERATE',
    systemMessage: 'You are an API that provides a list of follow up messages for the given input. You do not add any commentary. You always answer in a code block.',
    userLabel: 'Input prompt provider',
    message: `
    You are an AI language model, and your task is to provide four unique and highly specific suggestions that continue and progress the conversation thread on water management in indoor herb gardening. Each suggestion should reference specific details or themes from previous messages and be presented in a JSON format.

    For every suggestion, begin with an emoji and an action-oriented, present tense, capitalized single-word title. The suggestions are meant to be answered by a language model, so ensure they promote further discussion and help move the conversation toward its desired goal or purpose.

    You answer in the following JSON format, provided in a markdown code block.

    Example:

    Topic: Indoor Herb Gardening - Water Management

    Previous Messages:
    1. "I've noticed that my indoor herb garden requires different watering techniques compared to outdoor gardens. What should I consider when watering?"
    2. "I've heard about self-watering planters for indoor gardening. How do they work, and are they effective?"
    3. "I'm concerned about over-watering my indoor herb garden. How can I determine the right amount of water for each plant?"

    ** REMEMBER: that is just an EXAMPLE topic, the real topic and messages will be provided in the prompt.
    
    {
      "suggestions": [
        "💧 Measure: What tools or techniques can help determine the appropriate moisture levels for each herb in an indoor garden?",
        "🌿 Adapt: How can one adjust their watering schedule to accommodate the specific needs of different herbs in an indoor garden?",
        "📚 Learn: Are there any resources, such as books or online courses, that can help learn more about proper water management in indoor herb gardening?",
        "🔄 Recycle: What methods can be employed to recycle water and minimize waste in an indoor herb garden?"
      ]
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
