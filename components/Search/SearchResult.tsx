import React, { useEffect, useState } from 'react';
import * as Types from './types';
import { Box, Button, Dropdown, Item, LoadingSpinner } from '@avsync.live/formation'
import { insertContentByUrl } from 'client/connectivity/fetch';
import { useLexi_query, useLexi_setQuery } from 'redux-tk/lexi/hook';
import styled from 'styled-components';
// @ts-ignore
import { convert } from 'html-to-text'

export const SearchResult = ({ result }: { result: Types.SearchResult }) => {
  const set_query = useLexi_setQuery()
  const query = useLexi_query()
  const [hasClicked, set_hasClicked] = useState(false)
  const [disabled, set_disabled] = useState(false)

  useEffect(() => {
    set_hasClicked(false)
    set_disabled(false)
  }, [result.url])

  return (
    <S.SearchResult
      onClick={() => {
        if (!disabled) {
          set_disabled(true)
          insertContentByUrl(result.url, content => {
            set_query(`${query}\n${content}`)
            set_disabled(false)
          })
          set_hasClicked(true)
        }
      }}
      hasClicked={hasClicked}
      disabled={disabled}
    >
      <Box wrap maxWidth={'100%'} width={'100%'}>
        <Box mb={-.25} width={'100%'}>
          <Item
            subtitle={result.url?.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)?.[1]}
            src={result.favicons.low_res}
            children={
              <div >
             
              <Box mr={1.5} width='calc(100% - 1.75rem)'>
              {
                disabled && <LoadingSpinner small />
              }
               <Button
                  icon='plus'
                  iconPrefix='fas'
                  minimalIcon
                  minimal
                  square
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!disabled) {
                      set_disabled(true)
                      insertContentByUrl(result.url, content => {
                        set_query(`${query}\n${convert(content).replace(/\[[^\]]*\]/g, '')}`)
                        set_disabled(false)
                      })
                      set_hasClicked(true)
                    }
                  }}
                />
                <Button
                  icon='up-right-from-square'
                  iconPrefix='fas'
                  minimal
                  minimalIcon
                  href={result.url}
                  newTab
                  square
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                />
              </Box>
              </div>
           }
          />
        </Box>
        <Item 
          text={result.title}
          subtitle={result.description}
          src='d'
          
          newTab={true}
        
        />
      
        
      </Box>
    </S.SearchResult>
  );
}

const S = {
  SearchResult: styled.div<{
    hasClicked: boolean;
    disabled?: boolean
  }>`
  width: 100%;
  opacity: ${props => props.hasClicked ? '0.5' : '1'};
  * {
    cursor: ${props => props.disabled ? 'wait' : 'pointer'};

  }
    &:hover {
      background: var(--F_Surface);
    }
  `
}