import React from 'react';
import * as Types from './types';
import { Metadata } from './Metadata';
import { Books } from './Books';
import { TVShowsAndMovies } from './TVShowsAndMovies';
import { Images } from './Images';

export const KnowledgePanel = ({ knowledge_panel }: { knowledge_panel: Types.KnowledgePanel }) => (
  <div>
    {knowledge_panel.type && <h2>{knowledge_panel.type}</h2>}
    {knowledge_panel.title && <h3>{knowledge_panel.title}</h3>}
    {knowledge_panel.description && <p>{knowledge_panel.description}</p>}
    {knowledge_panel.url && <a href={knowledge_panel.url}>{knowledge_panel.url}</a>}
    <Metadata metadata={knowledge_panel.metadata} />
    <Books books={knowledge_panel.books} />
    <TVShowsAndMovies tv_shows_and_movies={knowledge_panel.tv_shows_and_movies} />
    <Images images={knowledge_panel.images} />
  </div>
);