import { HTMLtoPlaintext, Item } from '@avsync.live/formation'
import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { UniversalSearchResults } from 'redux-tk/search'
import styled from 'styled-components'
import { debounce } from 'lodash'
import { findRelationships } from 'redux-tk/util'
import { useRouter } from 'next/router'
import { useSpaces_setActiveMessageGuid, useSpaces_setActiveThreadGuid } from 'redux-tk/spaces/hook'

interface Props {
  searchResults: UniversalSearchResults
  query: string
}

const SUBSTRING_LENGTH = 120

const areEqual = (prevProps: any, nextProps: any) => {
  return (
    prevProps.message === nextProps.message &&
    prevProps.type === nextProps.type &&
    prevProps.properties === nextProps.properties &&
    prevProps.query === nextProps.query
  )
}

const GenericItemMemo = React.memo(({ item, query, type, properties }: { item: any, type: 'Messages' | 'Threads' | 'Channels' | 'Groups' | 'Spaces', query: string, properties: string[] }) => {
  const [highlightMatch, setHighlightMatch] = useState<JSX.Element[]>([])
  const router = useRouter()
  const setActiveThreadGuid = useSpaces_setActiveThreadGuid()
  const setActiveMessageGuid = useSpaces_setActiveMessageGuid()

  useEffect(() => {
    const newHighlightMatch = properties.reduce<JSX.Element[]>((acc, property) => {
      const message = item[property]
      const lowerMessage = message.toLowerCase()
      const matchIndex = lowerMessage.indexOf(query.toLowerCase())

      if (matchIndex !== -1)
      {
        const start = Math.max(matchIndex - SUBSTRING_LENGTH, 0)
        const end = Math.min(matchIndex + SUBSTRING_LENGTH + query.length, message.length)
        const pre = message.substring(start, matchIndex)
        const match = message.substring(matchIndex, matchIndex + query.length)
        const post = message.substring(matchIndex + query.length, end)
        const preEllipsis = start > 0 ? '...' : ''
        const postEllipsis = end < message.length ? '...' : ''
        
        acc.push(
          <div key={property}>
            {preEllipsis}{pre}<S.Strong>{match}</S.Strong>{post}{postEllipsis}
          </div>
        )
      }
      return acc
    }, [])

    setHighlightMatch(newHighlightMatch)
  }, [item, properties, query])

  const handleClick = async () => {
    // Assume the item has a type and guid, adjust as necessary
    const relationshipObject = findRelationships(item.guid, type)
  
    if (type === 'Messages') {
      const url = `/spaces/${relationshipObject.spaceGuid}/groups/${relationshipObject.groupGuid}/channels/${relationshipObject.channelGuid}`
      const queryParams = '' // `?thread=${relationshipObject.threadGuid}&message=${item.guid}`
      await router.push(url + queryParams)
      setActiveThreadGuid(relationshipObject.threadGuid)
      setActiveMessageGuid(item.guid)
    }
  
    if (type === 'Threads') {
      const url = `/spaces/${relationshipObject.spaceGuid}/groups/${relationshipObject.groupGuid}/channels/${relationshipObject.channelGuid}`
      const queryParams = '' // `?thread=${relationshipObject.threadGuid}`
      await router.push(url + queryParams)
      setActiveThreadGuid(relationshipObject.threadGuid)
    }
  
    if (type === 'Channels') {
      const url = `/spaces/${relationshipObject.spaceGuid}/groups/${relationshipObject.groupGuid}/channels/${relationshipObject.channelGuid}`
      await router.push(url)
    }
  
    if (type === 'Groups') {
      const url = `/spaces/${relationshipObject.spaceGuid}/groups/${relationshipObject.groupGuid}`
      await router.push(url)
    }
  
    if (type === 'Spaces') {
      const url = `/spaces/${relationshipObject.spaceGuid}`
      await router.push(url)
    }
  }
  

  return (
    <S.Item onClick={handleClick}>
      { highlightMatch }
    </S.Item>
  )
}, areEqual)

const renderResults = (items: any[], type: 'Messages' | 'Threads' | 'Channels' | 'Groups' | 'Spaces', properties: string[], lowerQuery: string) => {
  if (!items || items.length === 0) return null
  
  return (
    <>
      <Item text={`${type} (${items.length})`} />
      {
        items.map((item, index) => (
          <GenericItemMemo
            key={`${type}${index}`}
            item={item}
            type={type}
            query={lowerQuery}
            properties={properties}
          />
        ))
      }
    </>
  )
}

export const Harmony = ({ searchResults, query }: Props) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const lowerQuery = useMemo(() => debouncedQuery.toLowerCase(), [debouncedQuery])

  const handleDebounce = useCallback(
    debounce((newQuery) => {
      setDebouncedQuery(newQuery)
    }, 3000),
    []
  )
  
  useEffect(() => {
    handleDebounce(query)
  }, [query, handleDebounce])
  return (
    <S.Harmony>
      {renderResults(searchResults?.messages ?? [], 'Messages', ['message'], lowerQuery)}
      {renderResults(searchResults?.threads ?? [], 'Threads', ['name', 'description'], lowerQuery)}
      {renderResults(searchResults?.channels ?? [], 'Channels', ['name', 'description'], lowerQuery)}
      {renderResults(searchResults?.groups ?? [], 'Groups', ['name', 'description'], lowerQuery)}
      {renderResults(searchResults?.spaces ?? [], 'Spaces', ['name', 'description'], lowerQuery)}
    </S.Harmony>
  )
}

const S = {
  Harmony: styled.div`
    width: 100%;
  `,
  Item: styled.div`
    width: calc(100% - 1rem);
    font-size: var(--F_Font_Size_Small);
    color: var(--F_Font_Color_Label);
    padding: 0 .5rem;
    padding-top: .25rem;
    padding-bottom: .5rem;
    cursor: pointer;
    &:hover {
      background: var(--F_Surface);
    }
  `,
  Strong: styled.span`
    color: var(--F_Primary_Variant);
  `
}
