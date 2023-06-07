import { scrollToElementById, Box, Button, Dropdown, Item, Page, Spacer, useBreakpoint } from '@avsync.live/formation'
import React, { useEffect, useRef, useState } from 'react'
import { use100vh } from 'react-div-100vh'
import { useLayout_decrementActiveSwipeIndex } from 'redux-tk/layout/hook'
import { useSpaces_activeChannel, useSpaces_activeGroup, useSpaces_activeSpace, useSpaces_activeThreadGuid, useSpaces_setActiveThreadGuid, useSpaces_threadsByGuid } from 'redux-tk/spaces/hook'
import styled from 'styled-components'
import { Indicator } from './Indicator'
import { Threads } from './Threads'

import { ChatBox } from './ChatBox'
import { useLanguage_query } from 'redux-tk/language/hook'

interface Props {
  
}

export const Channel = React.memo(({ }: Props) => {
  const true100vh = use100vh()

  const { isDesktop } = useBreakpoint()

  const decrementActiveSwipeIndex = useLayout_decrementActiveSwipeIndex()

  const activeChannel = useSpaces_activeChannel()
  const activeSpace = useSpaces_activeSpace()
  const activeGroup = useSpaces_activeGroup()

  const handleClickBottom = () => {
    scrollToElementById(`bottom_channel`, {
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    })
  }
  
  const [height, setHeight] = useState(160);

  return (<S.Channel true100vh={true100vh || 0}>
    <Box height='var(--F_Header_Height)' width={'100%'}>
      <Item>
        
        <Item
          subtitle={activeSpace?.name && `${activeSpace?.name} > ${activeGroup?.name} > ${activeChannel?.name}`}
          onClick={() => {
            if (!isDesktop) {
              decrementActiveSwipeIndex()
            }
          }}
        />
        <Button
          icon='chevron-down'
          iconPrefix='fas'
          minimalIcon
          minimal
          onClick={() => {
            handleClickBottom()
          }}
        />
        <Indicator
          count={activeChannel?.threadGuids?.length}
        />
        <Dropdown
          icon='ellipsis-h'
          iconPrefix='fas'
          minimal
          minimalIcon
          items={[
            {
              icon: 'edit',
              iconPrefix: 'fas',
              name: 'Edit',
              href: `/spaces/${activeSpace?.guid}/groups/${activeGroup?.guid}/channels/${activeChannel?.guid}/edit`,
              onClick: () => {
                if (!isDesktop) {
                  decrementActiveSwipeIndex()
                }
              }
            },
            {
              icon: 'trash-alt',
              iconPrefix: 'fas',
              name: 'Delete',
            }
          ]}
        />
      </Item>
    </Box>

    <S.Content height={height}>
      <Threads />
      <div id='bottom_channel' />
    </S.Content>

    
    <ChatBox 
      onHeightChange={newHeight => setHeight(newHeight)}
    />
  </S.Channel>)
})

const S = {
  Channel: styled.div<{
    true100vh: number
  }>`
    height: ${props => `calc(calc(${props.true100vh}px - calc(var(--F_Header_Height) * 1)) - 2px)`};
    width: 100%;
    display: flex;
    flex-wrap: wrap;

  `,
  Content: styled.div<{
    height: number
  }>`
    height: ${props => `calc(100% - ${props.height}px)`};
    width: 100%;
    overflow-y: auto;
  `,
}