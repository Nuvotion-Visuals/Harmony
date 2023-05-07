import React, { useEffect, useState } from 'react';
import * as Types from './types';
import { Box, Button, Dropdown, Gap, Icon, Item, LoadingSpinner, HTMLtoPlaintext } from '@avsync.live/formation'
import { insertContentByUrl } from 'client/connectivity/fetch';
import { useLanguage_query, useLanguage_setQuery } from 'redux-tk/language/hook';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useLayout_decrementActiveSwipeIndex } from 'redux-tk/layout/hook';

export const SearchResult = ({ result }: { result: Types.SearchResult }) => {
  const decrementActiveSwipeIndex = useLayout_decrementActiveSwipeIndex()
  const router = useRouter()
  const {
    spaceGuid,
    groupGuid,
    channelGuid
  } = router.query

  const set_query = useLanguage_setQuery()
  const query = useLanguage_query()
  const [hasClicked, set_hasClicked] = useState(false)
  const [disabled, set_disabled] = useState(false)
  const [error, set_error] = useState(false)
  const [loading, set_loading] = useState(false)

  useEffect(() => {
    set_hasClicked(false)
    set_disabled(false)
  }, [result.url])

  return (
    <S.SearchResult
      onClick={(e) => {
        e.stopPropagation()
        if (!disabled) {
          set_disabled(true)
          set_loading(true)
          insertContentByUrl(result.url, 
            content => {
              decrementActiveSwipeIndex()
              setTimeout(() => {
                router.push(`/spaces/${spaceGuid}/groups/${groupGuid}/channels/${channelGuid}?url=${result.url}`)

              }, 100)
              set_loading(false)
            },
            error => {
              set_error(true)
              set_disabled(false)
              set_loading(false)
            }
          )
          set_hasClicked(true)
        }
      }}
      hasClicked={hasClicked}
      disabled={disabled}
      active={router.asPath.includes(result.url)}
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
                loading && <Box mr={1.5}><LoadingSpinner small /></Box>
              }
              <Gap disableWrap>
                {
                  error && <Icon icon='triangle-exclamation' />
                }
              <Button
                  icon='plus'
                  iconPrefix='fas'
                  minimalIcon
                  minimal
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!disabled) {
                      insertContentByUrl(
                        result.url, 
                        content => {
                          set_query(`${query}\n${HTMLtoPlaintext(content).replace(/\[[^\]]*\]/g, '')}`)
                          set_disabled(false)
                        },
                        error => {
                          alert('e')
                        }
                      )
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
              </Gap>
              
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
    disabled?: boolean;
    active?: boolean;
  }>`
  width: calc(100% - .25rem);
  opacity: ${props => props.hasClicked ? '0.5' : '1'};
  background: ${props => props.active ? 'var(--F_Surface_0)' : 'none'};
  border-left: ${props => props.active ? '.325rem solid var(--F_Primary)' : ''};
  padding-left: .25rem;
  * {
    cursor: ${props => props.disabled ? 'wait' : 'pointer'};

  }
    &:hover {
      background: var(--F_Surface);
    }
  `
}