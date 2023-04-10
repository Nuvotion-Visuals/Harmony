import React from 'react';
import * as Types from './types';
import { Box, Item } from '@avsync.live/formation';
import styled from 'styled-components';

export const Images = ({ images }: { images: Types.KnowledgePanel["images"] }) => {
  if (images.length === 0) return null;

  return (
    <Box width='100%' wrap>
      <S.Images>
        {images.map((image, index) => (
            <S.Image src={image.url} alt={image.alt} />
        ))}
      </S.Images>
    </Box>
  );
};

const S = {
  Images: styled.div`
    height: 200px;
    width: 100%;
    overflow-x: auto;
    display: flex;
    gap: .5rem;
    padding: 0 .5rem;
  `,
  Image: styled.img`
    border-radius: .75rem;
  `
}