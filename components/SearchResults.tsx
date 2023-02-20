import { Box, LoadingSpinner } from '@avsync.live/formation'
import React, { useEffect, useState } from 'react'
import { useLexi } from 'redux-tk/lexi/hook'
import styled from 'styled-components'
import LogoPlaceholder from './LogoPlaceholder'

interface Props {
  
}

export const SearchResults = React.memo(({ }: Props) => {
    const {
    searchQuery
  } = useLexi()

  const [loading, set_loading] = useState(true)

  useEffect(() => {
    set_loading(true)
  }, [searchQuery])

  return (
    <>
    {
      searchQuery && loading &&
        <Box width='100%' py={1.25}>
          <LoadingSpinner />
        </Box>
    }
     {
        searchQuery
          ? <S.Iframe 
              src={searchQuery ? `https://search.lexi.studio/search?q=${searchQuery}` : ''} 
              width='100%'
              onLoad={() => set_loading(false)}
            >
            </S.Iframe>
          : <LogoPlaceholder />
      }
    </>
   
  )
})

const S = {
  Iframe: styled.iframe`
    width: 100%;
    height: 100%;
    overflow: hidden;
  `,
}

