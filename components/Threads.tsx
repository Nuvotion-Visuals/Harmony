import { Button, Gap, LineBreak, generateUUID, Item, TextInput, RichTextEditor, Box, Page } from '@avsync.live/formation'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import { Thread as ThreadProps, Message as MessageProps } from 'redux-tk/spaces/types'
import styled from 'styled-components'
import { NewMessage } from './NewMessage'
import { Thread } from './Thread'
import { scrollToBottom } from 'client-utils'
import { getWebsocketClient } from 'Lexi/System/Connectvity/websocket-client'
import { store } from 'redux-tk/store'

interface Props {
  
}

export const Threads = ({ }: Props) => {
  const router = useRouter()
  const { query } = router
  const { spaceGuid, groupGuid, channelGuid } = query

  useEffect(() => {
    setActiveGroupGuid(groupGuid as string)
    setActiveChannelGuid(channelGuid as string)
  }, [groupGuid, channelGuid])

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollToBottom(scrollContainerRef)
  }, [router.route])

  const { 
    addThread,
    addMessage,
    threadsByGuid,
    messagesByGuid,
    messageGuids,
    updateMessage,
    addThreadToChannel,
    addMessageToThread,
    setActiveThreadGuid,
    setActiveMessageGuid,
    setActiveChannelGuid,
    setActiveGroupGuid,
    activeChannel
  } = useSpaces() 

  // websocket communication with server
  const websocketClient = getWebsocketClient()
  useEffect(() => {
    if (websocketClient) {
      websocketClient.onmessage = (ev) => {
        const { 
          guid, 
          message, 
          type,
          conversationId,
          parentMessageId,
          chatGptLabel,
          promptPrefix,
          userLabel,
        } = JSON.parse(ev.data.toString())
        console.log(type, message)

        if (type === 'response') {
          const targetThreadMessageGuids = store.getState().spaces.threadsByGuid[conversationId].messageGuids
          const targetMessageGuid = targetThreadMessageGuids.slice(-1)[0]

          const newMessage ={
            guid: targetMessageGuid,
            message,
            conversationId,
            parentMessageId,
            userLabel: 'Lexi'
          } as MessageProps
        
          updateMessage({ guid: targetMessageGuid, message: newMessage })
        }
        if (type === 'partial-response') {
          const targetThreadMessageGuids = store.getState().spaces.threadsByGuid[conversationId].messageGuids
          const targetMessageGuid = targetThreadMessageGuids.slice(-1)[0]
          const targetMessageContent = messagesByGuid[targetMessageGuid].message


          const newMessage ={
            guid: targetMessageGuid,
            message,
            conversationId,
            parentMessageId,
            userLabel: 'Lexi'
          } as MessageProps
        
          updateMessage({ guid: targetMessageGuid, message: newMessage })
        }
      }
    }
  }, [websocketClient])

  const [newThreadName, set_newThreadName] = useState('')
  const [newThreadDescription, set_newThreadDescription] = useState('')

  return (<S.Threads ref={scrollContainerRef}>
    <Box
      width='100%'
      height={'100vh'}
    />
    <Page noPadding>

    {
      activeChannel?.threadGuids?.map(threadGuid =>
        <>
        <Thread
          {
            ...threadsByGuid[threadGuid]
          }
          threadGuid={threadGuid}
        />
        <LineBreak />
        </>
      ) 
    }
    
    <Box width={'100%'} py={1}>
      <NewMessage 
        newThreadName={newThreadName}
        set_newThreadName={set_newThreadName}
        newThreadDescription={newThreadDescription}
        set_newThreadDescription={set_newThreadDescription}
        channelGuid={channelGuid as string} 
        thread={true} 
        onSend={(message) => {
          const guid = generateUUID()
          const newThread = {
            guid,
            name: newThreadName,
            channelGuid,
            messageGuids: [],
            description: newThreadDescription
          } as ThreadProps
          addThread({ guid, thread: newThread })
          addThreadToChannel({ channelGuid: channelGuid as string, threadGuid: guid })
          
          const messageGuid = generateUUID()
          const newMessage ={
            guid: messageGuid,
            userLabel: 'User',
            message,
            conversationId: guid,
            parentMessageId: messageGuid
          } as MessageProps
          addMessage({ guid: messageGuid, message: newMessage})
          addMessageToThread({ threadGuid: guid, messageGuid })

          const responseGuid = generateUUID()
          const newResponse ={
            guid: responseGuid,
            message: '',
            conversationId: guid,
            parentMessageId: messageGuid,
            userLabel: 'Lexi'
          } as MessageProps
          addMessage({ guid: responseGuid, message: newResponse })
          addMessageToThread({ threadGuid: guid, messageGuid: responseGuid })

          const action = {
            type: 'message',
            guid,
            message,
            conversationId: guid,
            parentMessageId: messageGuid,
            chatGptLabel: 'Lexi',
            promptPrefix: 'You are Lexi',
            userLabel: 'User',
          }
          websocketClient.send(JSON.stringify(action))
        }}
      />
    </Box>
    </Page>
  </S.Threads>)
}

const S = {
  Threads: styled.div`
    width: 100%;
    height: calc(100% - var(--F_Header_Height));
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    overflow-y: auto;
    overflow-x: hidden;
    background: var(--F_Background_Alternating);
  `
}