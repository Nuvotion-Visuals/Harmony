import React from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import styled from 'styled-components'

interface Props {
  
}

export const Badge = React.memo(({ }: Props) => {
    const { activeSpaceStats} = useSpaces()

  const { groupsCount, channelsCount, threadsCount, messageCount } = activeSpaceStats

  return (<S.Badge title={`${groupsCount} groups · ${channelsCount} channels · ${threadsCount} threads· ${messageCount} messages`}>
  {`${groupsCount}·${channelsCount}·${threadsCount}·${messageCount}`}
</S.Badge>)
})

const S = {
  Badge: styled.div`
    background: var(--F_Surface_0);
    padding: .5rem .75rem;
    border-radius: 1rem;
    color: var(--F_Font_Color_Disabled);
    font-family: monospace;
    display: flex;
    align-items: center;
    height: .75rem;
    line-height: 0;
  `
}