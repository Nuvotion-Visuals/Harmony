import { Box, Page } from '@avsync.live/formation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { 
  useSpaces_activeChannel, 
  useSpaces_activeThreadGuid, 
  useSpaces_messagesByGuid, 
  useSpaces_setActiveThreadGuid, 
  useSpaces_threadsByGuid 
} from 'redux-tk/spaces/hook'
import styled from 'styled-components'
import { Thread } from './Thread'
import { use100vh } from 'react-div-100vh'
import { ThreadsHeader } from './ThreadsHeader'
import { useRouter } from 'next/router'
import _ from 'lodash'

interface ThreadWrapperProps {
  threadGuid: string
  threadsByGuid: any
  expanded: boolean
  threadProps: any
  onExpand: (threadGuid: string) => void
  messages: any,
  active: boolean
}

const areEqual = (
  prevProps: ThreadWrapperProps,
  nextProps: ThreadWrapperProps
) => {
  return (
    prevProps.threadGuid === nextProps.threadGuid &&
    _.isEqual(prevProps.threadsByGuid, nextProps.threadsByGuid) && 
    prevProps.expanded === nextProps.expanded &&
    prevProps.onExpand === nextProps.onExpand &&
    _.isEqual(prevProps.messages, nextProps.messages) && 
    _.isEqual(prevProps.threadProps, nextProps.threadProps) &&
    _.isEqual(prevProps.active, nextProps.active)
  )
}

const ThreadWrapper = React.memo(
  ({ threadGuid, threadProps, expanded, onExpand, messages, active }: ThreadWrapperProps) => {
    
    return (
      <S.ThreadsContainer>
        <Thread
          {...threadProps}
          expanded={expanded}
          onExpand={() => {onExpand(threadGuid)}}
          threadGuid={threadGuid}
          messages={messages}
          active={active}
        />
      </S.ThreadsContainer>
    )
  },
  areEqual
)
interface Props {
  expandedThreads: { [key: string]: boolean }
  onExpand: (threadGuid: string) => void
}

export const Threads = React.memo(({
  expandedThreads, onExpand
}: Props) => {
  const router = useRouter()
  const { thread: threadGuidFromQuery } = router.query

  const activeChannel = useSpaces_activeChannel()
  const threadsByGuid = useSpaces_threadsByGuid()
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const true100vh = use100vh()
  const activeThreadGuid = useSpaces_activeThreadGuid()
  const messagesByGuid = useSpaces_messagesByGuid()

  return (<Box wrap width={'100%'}>
    <S.Threads ref={scrollContainerRef} true100vh={true100vh || 0}>
      <Page noPadding>
        <ThreadsHeader />
          {
            activeChannel?.threadGuids?.map((threadGuid) => (
              <ThreadWrapper
                key={threadGuid}
                threadGuid={threadGuid}
                threadsByGuid={threadsByGuid}
                expanded={expandedThreads[threadGuid]}
                onExpand={onExpand}
                threadProps={threadsByGuid[threadGuid]}
                messages={
                  threadsByGuid[threadGuid].messageGuids?.map((messageGuid) => 
                    messagesByGuid?.[messageGuid]
                  )
                }
                active={activeThreadGuid === threadGuid}
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
    }
  `
}