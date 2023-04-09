import React from 'react';
import * as Types from './types';

export const Metadata = ({ metadata }: { metadata: Types.KnowledgePanel["metadata"] }) => {
  if (metadata.length === 0) return null;

  return (
    <div>
      <h4>Metadata:</h4>
      <ul>
        {metadata.map((item, index) => (
          <li key={index}>
            <strong>{item.title}:</strong> {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
};