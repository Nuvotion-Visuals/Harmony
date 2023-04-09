import React from 'react';
import * as Types from './types';
import { Item } from '@avsync.live/formation'

export const SearchResult = ({ result }: { result: Types.SearchResult }) => (
  <Item 
    text={result.title}
    href={result.url}
    // @ts-ignore
    subtitle={<>
    {result.description}<br />{result.url}
    </>}
    src={result.favicons.low_res}
    newTab={true}
  />
);