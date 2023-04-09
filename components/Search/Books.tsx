import React from 'react';
import * as Types from './types';

export const Books = ({ books }: { books: Types.KnowledgePanel["books"] }) => {
  if (books.length === 0) return null;

  return (
    <div>
      <h4>Books:</h4>
      <ul>
        {books.map((book, index) => (
          <li key={index}>
            {book.title} ({book.year})
          </li>
        ))}
      </ul>
    </div>
  );
};
