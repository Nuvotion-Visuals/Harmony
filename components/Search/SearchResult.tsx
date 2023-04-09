import React from 'react';
import * as Types from './types';

export const SearchResult = ({ result }: { result: Types.SearchResult }) => (
  <div>
    <h3>{result.title}</h3>
    <p>{result.description}</p>
    {result.url && <a href={result.url}>{result.url}</a>}
    {result.favicons && (
      <div>
      <img src={result.favicons.low_res} alt="Website favicon" /> {/* Use low_res favicon instead of high_res */}
    </div>
    )}
  </div>
);