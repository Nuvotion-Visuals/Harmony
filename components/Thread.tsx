import { Box, Button, Dropdown, Gap, generateUUID, Item, Label, LineBreak, ParseHTML, RichTextEditor, TextInput } from '@avsync.live/formation'
import { getWebsocketClient } from 'Lexi/System/Connectvity/websocket-client'
import React, { useEffect, useRef, useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import { Thread as ThreadProps, Message as MessageProps } from 'redux-tk/spaces/types'
import styled from 'styled-components'
import { ItemMessage } from './ItemMessage'
import Message from './Message'
import { NewMessage } from './NewMessage'

interface Props extends ThreadProps {
  threadGuid: string,
  channelName: string
}

export const Thread = ({
    guid,
    name,
    channelGuid,
    messageGuids,
    description,
    threadGuid,
    channelName
 }: Props) => {

  const [newThreadName, set_newThreadName] = useState(name)
  const [newThreadDescription, set_newThreadDescription] = useState(description)



  const { 
    addThread,
    addMessage,
    threadsByGuid,
    messagesByGuid,
    addThreadToChannel,
    addMessageToThread,
    setActiveThreadGuid,
    setActiveMessageGuid,
    updateThread,
    setActiveChannelGuid,
    setActiveGroupGuid,
    activeChannel,
    removeThreadFromChannel,
    removeThread,
  } = useSpaces() 

  const websocketClient = getWebsocketClient()

  const [edit, set_edit] = useState(false)
  useEffect(() => {
    set_newThreadName(name)
    set_newThreadDescription(description)
  }, [edit])

  const expandedRef = useRef(false);
  const [expanded, setExpanded] = useState(expandedRef.current);

  const handleClick = () => {
    setExpanded(!expanded);
    expandedRef.current = !expanded;
  };

  return (<Box wrap width={'100%'} pb={.5}>
    <LineBreak />
    <Box width='100%' pt={.5} >
    {
      edit
        ? <Box width={'100%'} px={.75} wrap>
            <Box wrap width='calc(100% - 4rem)'>
              <Gap gap={.75}>
                <TextInput
                  value={newThreadName}
                  onChange={val => set_newThreadName(val)}
                  placeholder='Name'
                />
                <RichTextEditor
                  value={newThreadDescription}
                  onChange={val => set_newThreadDescription(val)}
                  placeholder={'Description'}
                />
              </Gap>
            </Box>
            <Box width={4} wrap> 
            <Box wrap mt={-3}>
            <Button
                primary
                circle
                hero
                icon='save'
                iconPrefix='fas'
                onClick={() => {
                  updateThread({ guid, thread: {
                    guid,
                    name: newThreadName,
                    channelGuid,
                    messageGuids,
                    description: newThreadDescription,
                    threadGuid,
                  } as ThreadProps})
            
                  set_edit(false)
                }}
              />
             <Button
                minimal
                circle
                hero
                icon='times'
                iconPrefix='fas'
                onClick={() => set_edit(!edit)}
              />
            </Box>
          </Box>
            
          </Box>
        : <Item
            icon={expanded ? 'caret-down' : 'caret-right'}
            iconPrefix='fas'
            minimalIcon
            title={name ? name : 'Untitled'}
            // @ts-ignore
            subtitle={description ? <ParseHTML html={description} /> : undefined}
            onClick={() => handleClick()}
          >
            <Label label={`${messageGuids.length / 2}`} labelColor='purple' />
            <div onClick={e => {
              e.preventDefault()
              e.stopPropagation()
            }}>
            <Dropdown
              icon='ellipsis-h'
              iconPrefix='fas'
              minimal
              items={[
                {
                  icon: 'edit',
                  iconPrefix: 'fas',
                  name: 'Edit',
                  onClick: () => set_edit(!edit)
                },
                {
                  icon: 'trash-alt',
                  iconPrefix: 'fas',
                  name: 'Delete',
                  onClick: (e) => {
                    removeThreadFromChannel({ threadGuid: guid, channelGuid})
                    removeThread(guid)
                  }
                }
              ]}
            />
            </div>
          </Item>
    }
    
    </Box>
    
    {
       messageGuids?.map((messageGuid, index) => {
        const message = messagesByGuid[messageGuid]

        return (
          expanded
           && <ItemMessage 
              {
                ...message
              }
            />
         

          
        )
      }
      )
    }
    
    {
      expanded &&
      <Box width={'100%'} pt={.5} wrap>
        {
          
        }
        <Box pb={.5} width='100%'>
          <Item subtitle={`${name}`} />
        </Box>
        <Box pb={.5} width='100%'>
          <NewMessage
            channelGuid={guid}
            thread={false}
            threadName={name}
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
     
    </Box>
    }
   
  </Box>)
}


const S = {
  VSpacer: styled.div`
    height: 100%;
    width: 3px;
    display: flex;
    background-color: red;
  `
}