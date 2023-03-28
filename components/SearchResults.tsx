import { Box, LoadingSpinner } from '@avsync.live/formation'
import React, { useEffect, useState } from 'react'
import { useLexi_searchQuery } from 'redux-tk/lexi/hook'
import styled from 'styled-components'
import LogoPlaceholder from './LogoPlaceholder'
import { MatrixLoading } from './MatrixLoading'

interface Props {
  
}

export const SearchResults = React.memo(({ }: Props) => {
  const searchQuery = useLexi_searchQuery()
  const [loading, set_loading] = useState(true)

  useEffect(() => {
    set_loading(true)
  }, [searchQuery])

  return (
    <>
    {
      searchQuery && loading &&
        <MatrixLoading></MatrixLoading>
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

