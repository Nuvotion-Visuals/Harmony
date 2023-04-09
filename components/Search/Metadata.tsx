import React from 'react';
import * as Types from './types';
import { Box, Item } from '@avsync.live/formation';

export const Metadata = ({ metadata }: { metadata: Types.KnowledgePanel["metadata"] }) => {
  if (metadata.length === 0) return null;

  return (
    <Box pb={.75} width={'100%'} wrap>
        {metadata.map((item, index) => (
          <Item
            text={item.title}
            subtitle={item.value}
          />
        ))}
    </Box>
  );
};