import { Button, Gap, generateUUID, Item, TextInput, RichTextEditor, Box, Dropdown, useBreakpoint, AspectRatio, } from '@avsync.live/formation'
import { useRouter } from 'next/router'
import React, { memo, useEffect, useState } from 'react'
import { useSpaces_activeChannel, useSpaces_activeGroup, useSpaces_activeSpace, useSpaces_addMessage, useSpaces_addMessageToThread, useSpaces_addThread, useSpaces_addThreadToChannel, useSpaces_setActiveChannelGuid, useSpaces_setActiveGroupGuid, useSpaces_threadsByGuid } from 'redux-tk/spaces/hook'
import { Thread as ThreadProps, Message as MessageProps } from 'redux-tk/spaces/types'
import styled from 'styled-components'
import { getWebsocketClient } from 'client/connectivity/websocket-client'
import { useLayout_decrementActiveSwipeIndex } from 'redux-tk/layout/hook'
import { Indicator } from './Indicator'
import { useLanguageAPI } from 'client/language/hooks'
import { ResponseStream } from './ResponseStream'
import { harmonySystemMessage } from 'systemMessage'

export const ThreadsHeader = memo(() => {
  const router = useRouter()
  const { query } = router
  const { groupGuid, channelGuid } = query

  useEffect(() => {
    setActiveGroupGuid(groupGuid as string)
    setActiveChannelGuid(channelGuid as string)
  }, [groupGuid, channelGuid])

  const addThread = useSpaces_addThread()
  const addMessage = useSpaces_addMessage()
  const threadsByGuid = useSpaces_threadsByGuid()
  const addThreadToChannel = useSpaces_addThreadToChannel()
  const addMessageToThread = useSpaces_addMessageToThread()
  const setActiveChannelGuid = useSpaces_setActiveChannelGuid()
  const setActiveGroupGuid = useSpaces_setActiveGroupGuid()
  const activeChannel = useSpaces_activeChannel()
  const activeSpace = useSpaces_activeSpace()
  const activeGroup = useSpaces_activeGroup()


  // websocket communication with server
  const [newThreadName, set_newThreadName] = useState('')
  const [newThreadDescription, set_newThreadDescription] = useState('')


  const decrementActiveSwipeIndex = useLayout_decrementActiveSwipeIndex()
  const { isDesktop } = useBreakpoint()

  
  const { language, response, loading, error, completed } = useLanguageAPI('');
  const { generate_threadPrompts } = language;
  
  const [suggestedPrompts, set_suggestedPrompts] = useState([])

  useEffect(() => {
    if (response && completed) {
      try {
        let obj = JSON.parse(response);
        set_suggestedPrompts(obj.suggestions)
      } catch (e) {}
    }
  }, [response, completed]);

  const [ existingThreads, set_existingThreads ] = useState('')
  useEffect(() => {
    if (activeChannel?.threadGuids) {
      set_existingThreads(activeChannel?.threadGuids?.map((threadGuid, index) => (
        `Existing thread: ${threadsByGuid[threadGuid]?.name} - ${threadsByGuid[threadGuid]?.description}`
      )).join('\n'))
    }
  }, [activeChannel?.threadGuids])


  


  const websocketClient = getWebsocketClient()

  const [feedback, set_feedback] = useState('')

  useEffect(() => {
    set_suggestedPrompts([])
    // @ts-ignore
    if (activeChannel?.description && getWebsocketClient?.send) {
        generate_threadPrompts(`
Space name: ${activeSpace?.name}
Space description: ${activeSpace?.description}

Channel name: ${activeChannel?.name}
Channel description: ${activeChannel?.description} 

Existing threads: \n${existingThreads}

Your previous suggestions (optional): ${suggestedPrompts}
                
User feedback (optional): ${feedback}
`)
    }
  }, [activeChannel?.threadGuids, websocketClient, activeChannel?.guid])




  const sendThread = (message: string) => {
    const websocketClient = getWebsocketClient()
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
      userLabel: 'You',
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
      userLabel: 'Harmony'
    } as MessageProps
    addMessage({ guid: responseGuid, message: newResponse })
    addMessageToThread({ threadGuid: guid, messageGuid: responseGuid })

    const action = {
      type: 'message',
      guid,
      message,
      conversationId: guid,
      parentMessageId: messageGuid,
      personaLabel: 'Harmony',
      systemMessage: harmonySystemMessage,
      userLabel: 'You',
    }
    websocketClient.send(JSON.stringify(action))
  }


  return (
    <Gap>
      {
        activeChannel?.description &&
          <>
            <Box width='100%' wrap>
              {
                activeChannel?.previewSrc &&
                <Box px={.75} width='100%'>
                  <S.ThreadPoster>
                    
                    <AspectRatio
                      backgroundSrc={activeChannel?.previewSrc}
                      ratio={3}
                      coverBackground
                    />
                  </S.ThreadPoster>
                </Box>
              }
                      
                <Item  minimalIcon pageTitle={activeChannel?.name}>
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
                        icon: 'lightbulb',
                        name: 'Suggest threads',
                        onClick: () => {
                          generate_threadPrompts(`
                          Space name: ${activeSpace?.name}
                          Space description: ${activeSpace?.description}
                          
                          Channel name: ${activeChannel?.name}
                          Channel description: ${activeChannel?.description} 
                          
                          Existing threads: \n${existingThreads}
                          
                          Your previous suggestions (optional): ${suggestedPrompts}
                                          
                          User feedback (optional): ${feedback}
                          `)
                        }
                      },
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
                
                <Box mt={-.75}  width='100%'>
                  <Item 
                    // @ts-ignore
                    subtitle={<RichTextEditor
                      value={activeChannel?.description || ''}
                      readOnly={true}
                    >
                    </RichTextEditor>}
                  >
                  
                  </Item>
                </Box>
              </Box>

              <Box width={'100%'} wrap>
                <Box width='100%' pb={.5}>
                  {
                    suggestedPrompts?.length && !loading
                      ? 
                          <Gap gap={.25}>
                            {
                              suggestedPrompts?.map(prompt =>
                                <Item
                                  subtitle={prompt}
                                  icon='paper-plane'
                                  onClick={() => {
                                    sendThread(prompt)
                                  }}
                                >
                                
                                </Item>
                              )
                            }
                          </Gap>
                        
                      : loading
                        ? <ResponseStream 
                            text={response || ''} 
                            icon='paper-plane'
                          />
                        : null
                  }
                </Box>

                <Box pb={.25} width='100%'>
                  <Box width='100%'>
                    <TextInput
                      value={feedback}
                      canClear={feedback !== ''}
                      compact
                      onChange={val => set_feedback(val)}
                      placeholder='Suggest new threads'
                      hideOutline
                    />
                    <Box pr={.5}>
                      <Button
                        icon='lightbulb'
                        expand
                        iconPrefix='fas'
                        secondary
                        text='Suggest'
                        onClick={() => generate_threadPrompts(`
                        Space name: ${activeSpace?.name}
                        Space description: ${activeSpace?.description}
                        
                        Channel name: ${activeChannel?.name}
                        Channel description: ${activeChannel?.description} 
                        
                        Existing threads: \n${existingThreads}
                        
                        Your previous suggestions (optional): ${suggestedPrompts}
                                        
                        User feedback (optional): ${feedback}
                        `)}
                      />
                    </Box>
                  </Box>
              </Box>
            </Box>
          </>
      }
    </Gap>
  )
})

const S = {

  ThreadPoster: styled.div`
    border-radius: 1rem;
    width: 100%;
    overflow: hidden;
  `
}