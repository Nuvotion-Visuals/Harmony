import { Box, Dropdown, generateUUID, Item, LineBreak, ParseHTML, RichTextEditor } from '@avsync.live/formation'
import { getWebsocketClient } from 'Lexi/System/Connectvity/websocket-client'
import React, { useEffect, useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import { Thread as ThreadProps, Message as MessageProps } from 'redux-tk/spaces/types'
import styled from 'styled-components'
import { ItemMessage } from './ItemMessage'
import Message from './Message'
import { NewMessage } from './NewMessage'

interface Props extends ThreadProps {
  threadGuid: string
}

export const Thread = ({
    guid,
    name,
    channelGuid,
    messageGuids,
    description,
    threadGuid,
 }: Props) => {

  const [newThreadName, set_newThreadName] = useState('')
  const [newThreadDescription, set_newThreadDescription] = useState('')

  const [message, set_message] = useState('')

  const { 
    addThread,
    addMessage,
    threadsByGuid,
    messagesByGuid,
    addThreadToChannel,
    addMessageToThread,
    setActiveThreadGuid,
    setActiveMessageGuid,
    setActiveChannelGuid,
    setActiveGroupGuid,
    activeChannel,
    removeThreadFromChannel,
    removeThread,
  } = useSpaces() 

  const websocketClient = getWebsocketClient()

  return (<Box wrap width={'100%'} pb={.75}>
    <LineBreak />
    <Box width='100%' py={.75}>

    <Item
      icon='caret-down'
      iconPrefix='fas'
      minimalIcon
      title={name ? name : 'Untitled'}
      // @ts-ignore
      subtitle={description ? <ParseHTML html={description} /> : 'No description'}
    >
      <Dropdown
        icon='ellipsis-h'
        iconPrefix='fas'
        minimal
        items={[
          {
            icon: 'edit',
            iconPrefix: 'fas',
            name: 'Edit'
          },
          {
            icon: 'trash-alt',
            iconPrefix: 'fas',
            name: 'Delete',
            onClick: (e) => {
              e.preventDefault()
              e.stopPropagation()
              removeThreadFromChannel({ threadGuid: guid, channelGuid})
              removeThread(guid)
            }
          }
        ]}
      />
    </Item>
    </Box>
    
    {
      messageGuids?.map(messageGuid => {
        const message = messagesByGuid[messageGuid]

        return (
          <ItemMessage 
            {
              ...message
            }
          />
        )
      }
      )
    }
    
    <Box width={'100%'} pt={.75}>
      <NewMessage
        channelGuid={guid}
        thread={false}
        onSend={(message) => {
          const messageGuid = generateUUID()
          const newMessage ={
            guid: messageGuid,
            message,
            conversationId: guid,
            parentMessageId: messageGuid,
            userLabel: 'User'
          } as MessageProps
          addMessage({ guid: messageGuid, message: newMessage})
          addMessageToThread({ threadGuid, messageGuid })
          const action = {
            type: 'message',
            guid,
            message,
            conversationId: threadGuid,
            parentMessageId: messageGuid,
            chatGptLabel: 'Lexi',
            promptPrefix: 'You are Lexi',
            userLabel: 'User',
          }
          websocketClient.send(JSON.stringify(action))

          const responseGuid = generateUUID()
          const newResponse ={
            guid: responseGuid,
            message: '',
            conversationId: guid,
            parentMessageId: messageGuid,
            userLabel: 'Lexi'
          } as MessageProps
          addMessage({ guid: responseGuid, message: newResponse })
          addMessageToThread({ threadGuid, messageGuid: responseGuid })
        }
      }
      />
    </Box>
  </Box>)
}
