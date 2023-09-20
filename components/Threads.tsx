import { Box, Page } from '@avsync.live/formation'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSpaces_activeChannel, useSpaces_activeGroup, useSpaces_activeSpace, useSpaces_activeThreadGuid, useSpaces_addMessage, useSpaces_addMessageToThread, useSpaces_addThread, useSpaces_addThreadToChannel, useSpaces_setActiveChannelGuid, useSpaces_setActiveGroupGuid, useSpaces_setActiveThreadGuid, useSpaces_threadsByGuid } from 'redux-tk/spaces/hook'
import styled from 'styled-components'
import { Thread } from './Thread'
import { use100vh } from 'react-div-100vh'
import { ThreadsHeader } from './ThreadsHeader'
import { useRouter } from 'next/router'

interface ThreadWrapperProps {
  threadGuid: string;
  threadsByGuid: any;
  expanded: boolean;
  onExpand: (threadGuid: string) => void;
}

const ThreadWrapper = React.memo(({ threadGuid, threadsByGuid, expanded, onExpand }: ThreadWrapperProps) => {
  const threadProps = useMemo(() => threadsByGuid[threadGuid], [threadsByGuid, threadGuid]);
  const handleThreadExpand = useCallback(() => onExpand(threadGuid), [onExpand]);
  
  return (
    <S.ThreadsContainer>
      <Thread
        {...threadProps}
        expanded={expanded}
        onExpand={handleThreadExpand}
        threadGuid={threadGuid}
      />
    </S.ThreadsContainer>
  );
})

interface Props {
  
}

export const Threads = React.memo(({ }: Props) => {
  const router = useRouter()
  const { thread: threadGuidFromQuery } = router.query

  const activeChannel = useSpaces_activeChannel()
  const threadsByGuid = useSpaces_threadsByGuid()
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const true100vh = use100vh()
  const activeThreadGuid = useSpaces_activeThreadGuid()
  const setActiveThreadGuid = useSpaces_setActiveThreadGuid()
  
  const [expandedThreads, setExpandedThreads] = useState<{ [key: string]: boolean }>({})

  const handleExpandClick = useCallback((threadGuid: string) => {
    setExpandedThreads(prev => ({
      ...prev,
      [threadGuid]: !prev[threadGuid]
    }))
  }, [])

  useEffect(() => {
    // Expand thread if its GUID exists in the query parameter
    if (threadGuidFromQuery) {
      setActiveThreadGuid(threadGuidFromQuery as string)
    }
  
    // Automatically expand the active thread
    if (activeThreadGuid) {
      setExpandedThreads(prev => ({
        ...prev,
        [activeThreadGuid]: true
      }))
    }

    // Automatically expand if there's only one thread
    if (activeChannel?.threadGuids?.length === 1) {
      const singleThreadGuid = activeChannel.threadGuids[0]
      setExpandedThreads(prev => ({
        ...prev,
        [singleThreadGuid]: true
      }))
    }
  }, [activeThreadGuid, activeChannel, threadGuidFromQuery])

  return (<Box wrap width={'100%'}>
    <S.Threads ref={scrollContainerRef} true100vh={true100vh || 0}>
      <Page noPadding>
        <ThreadsHeader />
        
          {
            activeChannel?.threadGuids?.map((threadGuid, index) => (
              <ThreadWrapper
                key={threadGuid}
                threadGuid={threadGuid}
                threadsByGuid={threadsByGuid}
                expanded={expandedThreads[threadGuid]}
                onExpand={handleExpandClick}
              />
            ))
          }
      </Page>
    </S.Threads>
  </Box>
  )
})

const S = {
  Threads: styled.div<{
    true100vh: number
  }>`
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
  `,
  ThreadPoster: styled.div`
    border-radius: 1rem;
    width: 100%;
    overflow: hidden;
  `,
  ThreadsContainer: styled.div`
    :nth-child(odd) {
      background: var(--F_Background);
      // CSS Property
  }
  `
}