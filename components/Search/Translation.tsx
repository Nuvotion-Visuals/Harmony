import React from 'react';
import * as Types from './types';

export const Translation = ({ translation }: { translation?: Types.Translation }) => {
  if (!translation) return null;

  return (
    <div>
      <h4>Translation:</h4>
      <p>
        <strong>Source Language:</strong> {translation.source_language}
      </p>
      <p>
        <strong>Target Language:</strong> {translation.target_language}
      </p>
      <p>
        <strong>Source Text:</strong> {translation.source_text}
      </p>
      <p>
        <strong>Target Text:</strong> {translation.target_text}
      </p>
    </div>
  );
};