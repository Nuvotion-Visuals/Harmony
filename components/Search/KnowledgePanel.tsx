import React from 'react';
import * as Types from './types';
import { Metadata } from './Metadata';
import { Books } from './Books';
import { TVShowsAndMovies } from './TVShowsAndMovies';
import { Images } from './Images';
import { Box, Item } from '@avsync.live/formation';

export const KnowledgePanel = ({ knowledge_panel }: { knowledge_panel: Types.KnowledgePanel }) => (
  <div>
    {
      knowledge_panel.title &&
        <Item
          pageTitle={knowledge_panel.title}
          subtitle={knowledge_panel.type || undefined}
        />
    }
     

    <Images images={knowledge_panel.images} />
    <Box pt={.75}>
      {
        knowledge_panel.description && knowledge_panel.url &&
          <Item
            text={knowledge_panel.description}
            subtitle={knowledge_panel.url}
          />
      }
    
    </Box>
   

    <Metadata metadata={knowledge_panel.metadata} />
    <Books books={knowledge_panel.books} />
    <TVShowsAndMovies tv_shows_and_movies={knowledge_panel.tv_shows_and_movies} />
  </div>
);