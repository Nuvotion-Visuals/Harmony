import { Box, Page } from '@avsync.live/formation'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSpaces_activeChannel, useSpaces_activeGroup, useSpaces_activeSpace, useSpaces_activeThreadGuid, useSpaces_addMessage, useSpaces_addMessageToThread, useSpaces_addThread, useSpaces_addThreadToChannel, useSpaces_setActiveChannelGuid, useSpaces_setActiveGroupGuid, useSpaces_threadsByGuid } from 'redux-tk/spaces/hook'
import styled from 'styled-components'
import { Thread } from './Thread'
import { use100vh } from 'react-div-100vh'
import { ThreadsHeader } from './ThreadsHeader'

interface Props {
  
}

export const Threads = ({ }: Props) => {
  const activeGroup = useSpaces_activeGroup()
  const activeChannel = useSpaces_activeChannel()
  const threadsByGuid = useSpaces_threadsByGuid()
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const true100vh = use100vh()
  

  const activeThreadGuid = useSpaces_activeThreadGuid()
  const selected = useMemo(() => activeGroup?.name && activeGroup?.name, [activeGroup]);
  
   const [expandedThreads, setExpandedThreads] = useState<boolean[]>([]);
  const handleExpandClick = useCallback((index: number) => {
    setExpandedThreads((prevExpandedThreads) => {
      const newExpandedThreads = [...prevExpandedThreads];
      newExpandedThreads[index] = !newExpandedThreads[index];
      return newExpandedThreads;
    });
  }, []);

    useEffect(() => {
    if (activeThreadGuid) {
      const targetIndex = activeChannel?.threadGuids.findIndex((item) => item === activeThreadGuid);
      if (targetIndex !== undefined) {
        setExpandedThreads((prevExpandedThreads) => {
          const newExpandedThreads = [...prevExpandedThreads];
          newExpandedThreads[targetIndex] = true;
          return newExpandedThreads;
        });
      }
    }
  }, [activeThreadGuid]);

  return (<Box wrap width={'100%'}>
    {
      selected
        ? <>
            <S.Threads ref={scrollContainerRef} true100vh={true100vh || 0}>
             
              <Page noPadding>
                <ThreadsHeader />
                
                  {
                    activeChannel?.threadGuids?.map((threadGuid, index) => (
                      <S.ThreadsContainer key={threadGuid}>
                        <Thread
                          {...threadsByGuid[threadGuid]}
                          expanded={expandedThreads?.[index]}
                          onExpand={() => handleExpandClick(index)}
                          threadGuid={threadGuid}
                        />
                      </S.ThreadsContainer>
                    ))
                  }
              </Page>
            </S.Threads>
          </>
        : <Box py={.25}>
            
          </Box>
    }
    
  </Box>
  )
}

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