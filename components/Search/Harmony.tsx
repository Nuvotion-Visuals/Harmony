import { HTMLtoPlaintext, Item } from '@avsync.live/formation'
import React, { useMemo, useState, useEffect } from 'react'
import { UniversalSearchResults } from 'redux-tk/search'
import styled from 'styled-components'
import { debounce } from 'lodash'

interface Props {
  searchResults: UniversalSearchResults
  query: string
}

const SUBSTRING_LENGTH = 120

const areEqual = (prevProps: any, nextProps: any) => {
  return prevProps.message === nextProps.message && prevProps.query === nextProps.query
}

const ItemMemo = React.memo(({ message, query }: { message: string, query: string }) => {
  const highlightMatch = useMemo(() => {
    const lowerMessage = message.toLowerCase()
    const matchIndex = lowerMessage.indexOf(query)

    if (matchIndex === -1) {
      return message
    }

    const start = Math.max(matchIndex - SUBSTRING_LENGTH, 0)
    const end = Math.min(matchIndex + SUBSTRING_LENGTH + query.length, message.length)
    const pre = message.substring(start, matchIndex)
    const match = message.substring(matchIndex, matchIndex + query.length)
    const post = message.substring(matchIndex + query.length, end)
    const preEllipsis = start > 0 ? '...' : ''
    const postEllipsis = end < message.length ? '...' : ''

    return <>{preEllipsis}{pre}<strong>{match}</strong>{post}{postEllipsis}</>
  }, [message, query])

  return (
    <S.Item>
      {highlightMatch}
    </S.Item>
  )
}, areEqual)

export const Harmony = ({ searchResults, query }: Props) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const lowerQuery = useMemo(() => debouncedQuery.toLowerCase(), [debouncedQuery])

  useEffect(() => {
    const handleDebounce = debounce((newQuery) => {
      setDebouncedQuery(newQuery)
    }, 3000)
    
    handleDebounce(query)
  }, [query])

  return (
    <S.Harmony>
      {
        searchResults?.messages &&
        <>
        <Item
          text={`Messages (${searchResults?.messages.length})`}
        />
          {
            searchResults.messages.map((message, index) => 
              <ItemMemo 
                key={`message${index}`} 
                message={HTMLtoPlaintext(message.message)} 
                query={lowerQuery} 
              />
            )
          }
        </>
      }
    </S.Harmony>
  )
}

const S = {
  Harmony: styled.div`
    width: 100%;
  `,
  Item: styled.div`
    width: 100%;
    font-size: var(--F_Font_Size_Small);
    color: var(--F_Font_Color_Label);
    padding: 0 .5rem;
    padding-top: .25rem;
    padding-bottom: .5rem;
  `,
}
