import React from 'react';
import * as Types from './types';

export const Images = ({ images }: { images: Types.KnowledgePanel["images"] }) => {
  if (images.length === 0) return null;

  return (
    <div>
      <h4>Images:</h4>
      <div>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image.url} alt={image.alt} />
            {image.source && <p>Source: {image.source}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};