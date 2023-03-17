import { useState } from 'react';
import { language_generateGroups } from './language-ws';

type PartialResponse = string; // Update with the correct type of the partial response
type ErrorType = string; // Update with the correct type of the error message

type GenerateGroupsFunction = () => void;
type UseGenerateGroups = (description: string) => [GenerateGroupsFunction, boolean, PartialResponse | null, boolean, ErrorType | null];

export const useGenerateGroups: UseGenerateGroups = (description) => {
  const [response, setResponse] = useState<PartialResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorType | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);

  const generateGroups: GenerateGroupsFunction = () => {
    setLoading(true);
    language_generateGroups(description, true,
      (message: string) => {
        setResponse(message);
        setCompleted(true);
      },
      (partialResponse: PartialResponse) => {
        setResponse(partialResponse);
      },
      (error: ErrorType) => {
        setError(error);
      }
    );
  };

  return [generateGroups, completed, response, loading, error];
};


