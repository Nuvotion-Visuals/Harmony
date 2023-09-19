import { scrollToElementById, Box, Button, Dropdown, Gap, generateUUID, Item, Label, LineBreak, LoadingSpinner, ParseHTML, RichTextEditor, Spacer, TextInput } from '@avsync.live/formation'
import { getWebsocketClient } from 'client/connectivity/websocket-client'
import { useLanguageAPI } from 'client/language/hooks'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSpaces_activeThreadGuid, useSpaces_addMessage, useSpaces_addMessageToThread, useSpaces_messagesByGuid, useSpaces_removeThread, useSpaces_removeThreadFromChannel, useSpaces_setActiveThreadGuid, useSpaces_updateThread } from 'redux-tk/spaces/hook'
import { Thread as ThreadProps, Message as MessageProps } from 'redux-tk/spaces/types'
import styled from 'styled-components'
import { Indicator } from './Indicator'
import { ItemMessage } from './ItemMessage'
import { ThreadSuggestions } from './ThreadSuggestions'
import { harmonySystemMessage } from 'systemMessage'
import { JsonValidator } from 'client/utils'

interface Props extends ThreadProps {
  threadGuid: string,
  expanded: boolean,
  onExpand: () => void
}

export const Thread = React.memo(({
    guid,
    name,
    channelGuid,
    messageGuids,
    description,
    threadGuid,
    expanded,
    onExpand
 }: Props) => {

  const [newThreadName, set_newThreadName] = useState(name)
  const [newThreadDescription, set_newThreadDescription] = useState(description)

 
  const [messageContent, set_messageContent] = useState('')

  useEffect(() => {
    const newMessageContent = messageGuids?.map((messageGuid, index) => {
      const message = messagesByGuid?.[messageGuid];
      return message?.message;
    }).join('\n');
    
    if (newMessageContent !== messageContent) {
      set_messageContent(newMessageContent);
    }
  }, [JSON.stringify(messageGuids)]);

  const { language, response, loading, error, completed } = useLanguageAPI(messageContent);
  const { generate_title } = language;
  
  useEffect(() => {
    if (response && completed) {
      try {
        let obj = JSON.parse(response);
        updateThread({
          guid,
          thread: {
            guid,
            channelGuid,
            messageGuids,
            name: obj.name,
            description: obj.description,
          }
        })
        scrollToElementById(`bottom_${guid}`, {
          behavior: 'auto',
          block: 'end',
          inline: 'nearest'
        })
        console.log(response)
      } catch (e) {}
    }
  }, [response, completed]);
  
  const addMessage = useSpaces_addMessage()
  const messagesByGuid = useSpaces_messagesByGuid()
  const addMessageToThread = useSpaces_addMessageToThread()
  const updateThread = useSpaces_updateThread()
  const removeThreadFromChannel = useSpaces_removeThreadFromChannel()
  const removeThread = useSpaces_removeThread()
  const setActiveThreadGuid = useSpaces_setActiveThreadGuid()
  const activeThreadGuid = useSpaces_activeThreadGuid()
   

  const [edit, set_edit] = useState(false)
  useEffect(() => {
    set_newThreadName(name)
    set_newThreadDescription(description)
  }, [edit])

  const sendMessageToWebsocket = (message: string) => {
  const websocketClient = getWebsocketClient()

    const messageGuid = generateUUID()
    const newMessage ={
      guid: messageGuid,
      message,
      conversationId: guid,
      parentMessageId: messageGuid,
      userLabel: 'You'
    } as MessageProps
    addMessage({ guid: messageGuid, message: newMessage})
    addMessageToThread({ threadGuid, messageGuid })
    const action = {
      type: 'message',
      guid,
      message,
      conversationId: threadGuid,
      parentMessageId: messageGuid,
      personaLabel: 'Harmony',
      systemMessage: harmonySystemMessage,
      userLabel: 'You',
    }
    websocketClient.send(JSON.stringify(action))

    // insert new message in anticipation of response
    const responseGuid = generateUUID()
    const newResponse ={
      guid: responseGuid,
      message: '',
      conversationId: guid,
      parentMessageId: messageGuid,
      userLabel: 'Harmony'
    } as MessageProps
    addMessage({ guid: responseGuid, message: newResponse })
    addMessageToThread({ threadGuid, messageGuid: responseGuid })
  }

  const showSpinner = loading

  useEffect(() => {
    if (messageGuids?.length === 2 && !name && !description) {
      if (messagesByGuid[messageGuids[1]]?.complete) {
        generate_title(messageContent)
      }
    }
  }, [messagesByGuid[messageGuids[1]]?.complete])

  const active = guid === activeThreadGuid

  const jsonValidatorRef = useRef(new JsonValidator())
  
  const temporaryName = jsonValidatorRef.current.parseJsonProperty(response, 'name') || 'Thinking...'
  const temporaryDescription = jsonValidatorRef.current.parseJsonProperty(response, 'description') || ''

  return (<S.Thread active={active}>
    <Box width='100%'>
    
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
                  value={newThreadDescription || ''}
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
            // @ts-ignore
            text={
              showSpinner 
                ? temporaryName
                : name
                  ? name : 'Thinking...'}
            // @ts-ignore
            subtitle={
              showSpinner
                ? temporaryDescription
                : description ? <ParseHTML html={description} /> : undefined
              }
            onClick={() => onExpand()}
          >
         
            <Indicator count={messageGuids?.length} />
            <div onClick={e => {
              e.preventDefault()
              e.stopPropagation()
            }}>
              <Box wrap maxWidth={2} ml={.25} mr={.25} >
                {
                  !active &&
                    <Box mb={.25} >
                      <Button
                        icon='reply'
                        iconPrefix='fas'
                        minimal
                        minimalIcon
                        onClick={() => {
                          setActiveThreadGuid(guid)
                          scrollToElementById(`bottom_${guid}`, {
                            behavior: 'smooth',
                            block: 'end',
                            inline: 'nearest'
                          })
                        }}
                      />
                    </Box>
                }
              
                <Dropdown
                  icon='ellipsis-h'
                  iconPrefix='fas'
                  minimal
                  minimalIcon

                  items={[
                    {
                      icon: 'reply',
                      iconPrefix: 'fas',
                      name: 'Reply',
                      onClick: () => {
                        setActiveThreadGuid(guid)
                        scrollToElementById(`bottom_${guid}`, {
                          behavior: 'smooth',
                          block: 'end',
                          inline: 'nearest'
                        })
                      }
                    },
                    {
                      icon: 'lightbulb',
                      iconPrefix: 'fas',
                      name: 'Generate title',
                      onClick: () => {
                        generate_title(messageContent)
                      }
                    },
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
                        if (activeThreadGuid === guid) {
                          setActiveThreadGuid(null)
                        }
                      }
                    }
                  ]}
                />
              </Box>
           
            </div>
          </Item>
    }
    
    </Box>
    <div id={`top_${guid}`}></div>
    {
      messageGuids?.map((messageGuid, index) => {
        const message = messagesByGuid?.[messageGuid]
        return (
          expanded && message && 
            <ItemMessage 
              key={messageGuid}
              {
                ...message
              }
              threadGuid={threadGuid}
            />
        )
      })
    }
    
    {
      expanded &&
        <Box width={'100%'}  mt={.25} wrap>
          <Gap>


          <ThreadSuggestions guid={guid} onSend={(message) => sendMessageToWebsocket(message)} />
            {
              activeThreadGuid !== guid &&
              <Box width='100%' px={.75} my={.25}>
                <Button
                  expand
                  icon='reply'
                  iconPrefix='fas'
                  text={activeThreadGuid === guid ? 'Replying' : 'Reply'}
                  secondary
                  disabled={activeThreadGuid === guid}
                  onClick={() => {
                    scrollToElementById(`bottom_${guid}`, {
                      behavior: 'smooth',
                      block: 'end',
                      inline: 'nearest'
                    })
                  
                    setActiveThreadGuid(guid)
                  }}  
                />
              </Box>
                
            }
        </Gap>
      </Box>
    }
   <div id={`bottom_${guid}`}></div>
  </S.Thread>)
})

const S = {
  Thread: styled.div<{
    active: boolean
  }>`
    width: calc(100% - 4px);
    display: flex;
    flex-wrap: wrap;
    border-left: ${props => props.active ? '4px solid var(--F_Primary)' : '4px solid var(--F_Surface_0)'};
    margin: .25rem 0;
    padding: .25rem 0;
    border-bottom: 1px solid var(--F_Surface_0);
  `
}