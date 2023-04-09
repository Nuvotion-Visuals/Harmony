import React from 'react';
import * as Types from './types';

export const Dictionary = ({ dictionary }: { dictionary?: Types.Dictionary }) => {
  if (!dictionary) return null;

  return (
    <div>
      <h4>Dictionary:</h4>
      <p>
        <strong>Word:</strong> {dictionary.word}
      </p>
      <p>
        <strong>Phonetic:</strong> {dictionary.phonetic}
      </p>
      <p>
        <strong>Audio:</strong> <audio controls>
          <source src={dictionary.audio} type="audio/mpeg" />
          </audio>
      </p>
      <div>
        <h5>Definitions:</h5>
        <ul>
          {dictionary.definitions.map((definition, index) => (
            <li key={index}>{definition}</li>
          ))}
        </ul>
      </div>
      <div>
        <h5>Examples:</h5>
        <ul>
          {dictionary.examples.map((example, index) => (
            <li key={index}>{example}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};