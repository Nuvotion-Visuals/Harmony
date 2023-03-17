import { useState } from 'react';
import { language_generateGroups,  language_test } from './language-ws';

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

type UseGenerateTitle = (description: string) => [GenerateGroupsFunction, boolean, PartialResponse | null, boolean, ErrorType | null];
export const useGenerateTitle: UseGenerateTitle = (description) => {
    const [response, setResponse] = useState<PartialResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorType | null>(null);
    const [completed, setCompleted] = useState<boolean>(false);
  
    const generateTitle: GenerateGroupsFunction = () => {
      setLoading(true);
      language_test(description, true,
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
  
    return [generateTitle, completed, response, loading, error];
  };
  
  