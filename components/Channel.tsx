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
  const threadsByGuid = useSpaces_threadsByGuid()
  const activeThreadGuid = useSpaces_activeThreadGuid()
  const setActiveThreadGuid = useSpaces_setActiveThreadGuid()

  const query = useLanguage_query()

  const handleClickBottom = () => {
    scrollToElementById(`bottom_channel`, {
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    })
  }
  
  const [height, setHeight] = useState(160);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (componentRef.current) {
        setHeight(componentRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    if (componentRef.current) {
      setHeight(componentRef.current.clientHeight);
    }
  }, [activeThreadGuid, query])

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

    <S.Bottom ref={componentRef}>
      <Page noPadding>
        {
          activeThreadGuid &&
            <S.Reply>
              <Item
                icon='reply'
                minimalIcon
                subtitle={` ${threadsByGuid?.[activeThreadGuid || '']?.name}`}
                onClick={() => {
                  scrollToElementById(`top_${activeThreadGuid}`, {
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                  })
                }}
              >
                <Spacer />
                <Button
                  icon='times'
                  iconPrefix='fas'
                  minimal
                  onClick={() => setActiveThreadGuid(null)}
                />
              </Item>
            </S.Reply>
          }
      </Page>
      <Box p={.5}>
        <ChatBox />
      </Box>
    </S.Bottom>
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
    /* background: var(--F_Background_Alternating); */

  `,
  Content: styled.div<{
    height: number
  }>`
    height: ${props => `calc(100% - ${props.height}px)`};
    width: 100%;
    overflow-y: auto;
  `,
  Bottom: styled.div`
    /* background: var(--F_Background_Alternating); */
    width: 100%;
    overflow-y: auto;
    max-height: 40vh;
  `,
  Reply: styled.div`
    width: 100%;
    border-left: 4px solid var(--F_Primary);
    height: 2rem;
    display: flex;
    align-items: center;
    overflow: hidden;
  `
}