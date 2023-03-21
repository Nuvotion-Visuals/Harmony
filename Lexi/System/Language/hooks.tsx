import { useReducer } from 'react';
import { 
  language_generateGroups, 
  language_generateTitleAndDescription, 
  language_generateThreadPrompts,
  language_generateFollowUpMessages
} from './language-ws';

type PartialResponse = string;
type ErrorType = string;

type State = {
  response: PartialResponse | null;
  loading: boolean;
  error: ErrorType | null;
  completed: boolean;
};

type Action =
  | { type: "SET_RESPONSE"; payload: PartialResponse }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: ErrorType | null }
  | { type: "SET_COMPLETED"; payload: boolean };

const initialState: State = {
  response: null,
  loading: false,
  error: null,
  completed: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_RESPONSE":
      return { ...state, response: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_COMPLETED":
      return { ...state, completed: action.payload };
    default:
      return state;
  }
};

export const useLanguageAPI = (initialValue: string) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const generate = (
    guid: string,
    enableEmoji: boolean,
    generateFunction: (
      guid: string,
      enableEmoji: boolean,
      onComplete: (message: string) => void,
      onPartialResponse: (partialResponse: PartialResponse) => void,
      onError: (error: ErrorType) => void
    ) => { removeListeners: () => void }
  ) => {
    dispatch({ type: "SET_LOADING", payload: true });

    const onComplete = (message: string) => {
      dispatch({ type: "SET_RESPONSE", payload: message });
      dispatch({ type: "SET_COMPLETED", payload: true });
      dispatch({ type: "SET_LOADING", payload: false }); // Add this line
      removeListeners();
    };

    const onPartialResponse = (partialResponse: PartialResponse) => {
      dispatch({ type: "SET_RESPONSE", payload: partialResponse });
    };

    const onError = (error: ErrorType) => {
      dispatch({ type: "SET_ERROR", payload: error });
      dispatch({ type: "SET_LOADING", payload: false }); // Add this line
      removeListeners();
    };

    const { removeListeners } = generateFunction(guid, enableEmoji, onComplete, onPartialResponse, onError);
  };

  const language = {
    generateGroups: (guid: string) => {
      generate(guid, true, language_generateGroups);
    },
    generateTitle: (guid: string) => {
      generate(guid, true, language_generateTitleAndDescription);
    },
    generateThreadPrompts: (guid: string) => {
      generate(guid, true, language_generateThreadPrompts);
    },
    generateFollowUpMessages: (guid: string) => {
      generate(guid, true, language_generateFollowUpMessages)
    }
  };

  return { language, ...state };
};
