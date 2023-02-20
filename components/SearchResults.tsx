import React from 'react'
import { useLexi } from 'redux-tk/lexi/hook'
import styled from 'styled-components'
import LogoPlaceholder from './LogoPlaceholder'

interface Props {
  
}

export const SearchResults = React.memo(({ }: Props) => {
    const {
    searchQuery
  } = useLexi()

  return (
    <>
     {
        searchQuery
        ? <S.Iframe 
            src={searchQuery ? `https://search.lexi.studio/search?q=${searchQuery}` : ''} 
            width='100%'
          >
            </S.Iframe>
        : <><LogoPlaceholder /></>
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

