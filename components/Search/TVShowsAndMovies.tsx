import React from 'react';
import * as Types from './types';

export const TVShowsAndMovies = ({ tv_shows_and_movies }: { tv_shows_and_movies: Types.KnowledgePanel["tv_shows_and_movies"] }) => {
  if (tv_shows_and_movies.length === 0) return null;

  return (
    <div>
      <h4>TV Shows and Movies:</h4>
      <ul>
        {tv_shows_and_movies.map((item, index) => (
          <li key={index}>
            {item.title} ({item.year})
          </li>
        ))}
      </ul>
    </div>
  );
};