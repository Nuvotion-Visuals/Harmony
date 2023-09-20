import { scrollToElementById, Box, Button, Dropdown, Item, useBreakpoint } from '@avsync.live/formation'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { use100vh } from 'react-div-100vh'
import { useLayout_decrementActiveSwipeIndex } from 'redux-tk/layout/hook'
import { useSpaces_activeChannel, useSpaces_activeGroup, useSpaces_activeSpace, useSpaces_activeThreadGuid, useSpaces_setActiveThreadGuid } from 'redux-tk/spaces/hook'
import styled from 'styled-components'
import { Indicator } from './Indicator'
import { Threads } from './Threads'

import { ChatBox } from './ChatBox'
import { useRouter } from 'next/router'


type ChannelHeaderProps = {
  activeSpace: {
    name: string,
    guid: string
  } | null,
  activeGroup: {
    name: string,
    guid: string
  } | null,
  activeChannel: {
    name: string,
    guid: string,
    threadGuids: string[]
  } | null,
  isDesktop: boolean,
  decrementActiveSwipeIndex: () => void,
  handleClickBottom: () => void,
  handleClickTop: () => void,
  toggleAllThreads: () => void,
  allExpanded: boolean
}

const ChannelHeader = memo(({ 
  activeSpace, 
  activeGroup,
  activeChannel, 
  isDesktop, 
  decrementActiveSwipeIndex, 
  handleClickBottom, 
  handleClickTop,
  allExpanded, 
  toggleAllThreads 
}: ChannelHeaderProps) => {
  return (
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
          icon={allExpanded ? 'chevron-up' : 'chevron-down'}
          iconPrefix='fas'
          minimalIcon
          minimal
          onClick={() => {
            toggleAllThreads()
          }}
        />
         <Button
          icon='arrow-up'
          iconPrefix='fas'
          minimalIcon
          minimal
          onClick={() => {
            handleClickTop()
          }}
        />
        <Button
          icon='arrow-down'
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
              name: 'Delete'
            }
          ]}
        />
      </Item>
    </Box>
  )
})

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

  const handleClickTop = () => {
    scrollToElementById(`top_channel`, {
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    })
  }
  
  const [height, setHeight] = useState(160);

  const [expandedThreads, setExpandedThreads] = useState<{ [key: string]: boolean }>({})

  const handleExpandClick = useCallback((threadGuid: string) => {
    setExpandedThreads(prev => ({
      ...prev,
      [threadGuid]: !prev[threadGuid]
    }))
  }, [])

  const router = useRouter()
  const { thread: threadGuidFromQuery } = router.query
  const activeThreadGuid = useSpaces_activeThreadGuid()
  const setActiveThreadGuid = useSpaces_setActiveThreadGuid()

  useEffect(() => {
    if (threadGuidFromQuery) {
      setActiveThreadGuid(threadGuidFromQuery as string)
    }
  
    if (activeThreadGuid) {
      setExpandedThreads(prev => ({
        ...prev,
        [activeThreadGuid]: true
      }))
    }

    if (activeChannel?.threadGuids?.length === 1) {
      const singleThreadGuid = activeChannel.threadGuids[0]
      setExpandedThreads(prev => ({
        ...prev,
        [singleThreadGuid]: true
      }))
    }
  }, [activeThreadGuid, activeChannel, threadGuidFromQuery])

  // New state variable to track if all threads are expanded
  const [allExpanded, setAllExpanded] = useState(false)

  // Function to toggle all threads
  const toggleAllThreads = useCallback(() => {
    const newExpandedState: { [key: string]: boolean } = {}
    activeChannel?.threadGuids?.forEach((threadGuid) => {
      newExpandedState[threadGuid] = !allExpanded
    })
    setExpandedThreads(newExpandedState)
    setAllExpanded(!allExpanded)
  }, [activeChannel, allExpanded])
  

  return (<S.Channel true100vh={true100vh || 0}>
    <ChannelHeader 
      activeSpace={activeSpace}
      activeGroup={activeGroup}
      activeChannel={activeChannel}
      isDesktop={isDesktop}
      decrementActiveSwipeIndex={decrementActiveSwipeIndex}
      handleClickBottom={handleClickBottom}
      handleClickTop={handleClickTop}
      toggleAllThreads={toggleAllThreads}
      allExpanded={allExpanded}
    />

    <S.Content height={height}>
      <div id='top_channel' />
      <Threads 
        expandedThreads={expandedThreads} 
        onExpand={handleExpandClick} 
      />
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