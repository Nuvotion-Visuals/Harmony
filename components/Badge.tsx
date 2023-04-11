import React from 'react'
import styled from 'styled-components'

interface Props {
  groupsCount: number,
  channelsCount: number,
  threadsCount: number,
  messageCount: number
}

export const Badge = React.memo(({ 
  groupsCount,
  channelsCount,
  threadsCount,
  messageCount
}: Props) => {

  return (
    <S.Badge title={`${groupsCount} groups · ${channelsCount} channels · ${threadsCount} threads· ${messageCount} messages`}>
      {`${groupsCount}·${channelsCount}·${threadsCount}·${messageCount}`}
    </S.Badge>
  )
})

const S = {
  Badge: styled.div`
    background: var(--F_Surface_0);
    padding: .5rem .75rem;
    border-radius: 1rem;
    color: var(--F_Font_Color_Label);
    font-family: monospace;
    display: flex;
    align-items: center;
    height: .75rem;
    line-height: 0;
  `
}