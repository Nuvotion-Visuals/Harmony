import React from 'react';
import * as Types from './types';
import { Metadata } from './Metadata';
import { Books } from './Books';
import { TVShowsAndMovies } from './TVShowsAndMovies';
import { Images } from './Images';
import { Box, Item } from '@avsync.live/formation';

export const KnowledgePanel = ({ knowledge_panel }: { knowledge_panel: Types.KnowledgePanel }) => (
  <Box width={'100%'} pb={.75} wrap>
    {
      knowledge_panel.title &&
        <Item
          pageTitle={knowledge_panel.title}
          subtitle={knowledge_panel.type || undefined}
        />
    }
     {
      knowledge_panel.images.length > 0 &&
        <Images images={knowledge_panel.images} />
     }
      {
        knowledge_panel.description && knowledge_panel.url &&
          <Box pt={.75}>
            <Item
              href={knowledge_panel.url}
              text={knowledge_panel.description}
              subtitle={knowledge_panel.url?.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)?.[1]}
            />
          </Box>  
      }

      {
        knowledge_panel.metadata &&
        <Metadata metadata={knowledge_panel.metadata} />
      }
    
    
    <Books books={knowledge_panel.books} />
    <TVShowsAndMovies tv_shows_and_movies={knowledge_panel.tv_shows_and_movies} />
  </Box>
);