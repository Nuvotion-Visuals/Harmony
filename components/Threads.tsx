import { Button, Gap, LineBreak, generateUUID, Item, TextInput, RichTextEditor, Box, Page, Tabs, Label, Dropdown, useBreakpoint, HTMLtoMarkdown, AspectRatio } from '@avsync.live/formation'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import { Thread as ThreadProps, Message as MessageProps } from 'redux-tk/spaces/types'
import styled from 'styled-components'
import { NewMessage } from './NewMessage'
import { Thread } from './Thread'
import { scrollToBottom } from 'client-utils'
import { getWebsocketClient } from 'Lexi/System/Connectvity/websocket-client'
import { use100vh } from 'react-div-100vh'
import { useLayout } from 'redux-tk/layout/hook'

interface Props {
  
}

export const Threads = ({ }: Props) => {
  const router = useRouter()
  const { query } = router
  const { groupGuid, channelGuid } = query

  useEffect(() => {
    setActiveGroupGuid(groupGuid as string)
    setActiveChannelGuid(channelGuid as string)
  }, [groupGuid, channelGuid])

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollToBottom(scrollContainerRef)
  }, [])

  const { 
    addThread,
    addMessage,
    threadsByGuid,
    addThreadToChannel,
    addMessageToThread,
    setActiveChannelGuid,
    setActiveGroupGuid,
    activeChannel,
    activeSpace,
    activeGroup
  } = useSpaces() 

  // websocket communication with server
  const [newThreadName, set_newThreadName] = useState('')
  const [newThreadDescription, set_newThreadDescription] = useState('')

  const true100vh = use100vh()

  const { decrementActiveSwipeIndex } = useLayout()
  const { isDesktop } = useBreakpoint()

  const selected = useMemo(() => activeGroup?.name && activeGroup?.name, [activeGroup]);

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
  }
  
  return (<Box wrap width={'100%'}>
    {
      selected
        ? <>
            <Box height='var(--F_Header_Height)' width={'100%'}>
              <Item
                
                icon='hashtag'
                minimalIcon
                
              >
                <Item
                  title={`${activeSpace?.name} > ${activeGroup?.name} > ${activeChannel?.name}`}
                  onClick={() => {
                    if (!isDesktop) {
                      decrementActiveSwipeIndex()
                    }
                  }}
                />
                {
                  activeChannel?.threadGuids?.length &&
                    <Label
                      label={`${activeChannel?.threadGuids?.length}`}
                      labelColor='purple'
                    />
                }
               
                <Dropdown
                  icon='ellipsis-h'
                  iconPrefix='fas'
                  minimal
                  items={[
                    {
                      icon: 'edit',
                      iconPrefix: 'fas',
                      name: 'Edit',
                      href: `/spaces/${activeSpace?.guid}/groups/${activeGroup?.guid}/channels/${activeChannel?.guid}/edit`
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
            <LineBreak />
            
            <S.Threads ref={scrollContainerRef} true100vh={true100vh || 0}>
              <Page noPadding>
                <Gap>
                  {
                    activeChannel?.previewSrc &&
                      <AspectRatio
                        backgroundSrc={activeChannel?.previewSrc}
                        ratio={2}
                        coverBackground
                      />
                  }
                  {
                    activeChannel?.description &&
                      <>
                        <Box mt={.25} width='100%'>
                          <Item title={activeChannel?.name} 
                            // @ts-ignore
                            subtitle={<RichTextEditor
                              value={activeChannel?.description || ''}
                              readOnly={true}
                            >
                            </RichTextEditor>}
                          >
                             {
                              activeChannel?.threadGuids?.length &&
                                <Label
                                  label={`${activeChannel?.threadGuids?.length}`}
                                  labelColor='purple'
                                />
                            }
                            <Dropdown
                              icon='ellipsis-h'
                              iconPrefix='fas'
                              minimal
                              items={[
                                {
                                  icon: 'edit',
                                  iconPrefix: 'fas',
                                  name: 'Edit',
                                  href: `/spaces/${activeSpace?.guid}/groups/${activeGroup?.guid}/channels/${activeChannel?.guid}/edit`
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
                      </>
                  }
                  <LineBreak />
                </Gap>
                
                {
                  activeChannel?.threadGuids?.map((threadGuid, index) => (
                    <React.Fragment key={threadGuid}>
                      <Thread
                        {
                          ...threadsByGuid[threadGuid]
                        }
                        threadGuid={threadGuid}
                      />
                      <LineBreak />
                    </React.Fragment>
                  ))
                }
                
                <Box width={'100%'} py={1}>
                  <NewMessage 
                    newThreadName={newThreadName}
                    set_newThreadName={set_newThreadName}
                    newThreadDescription={newThreadDescription}
                    set_newThreadDescription={set_newThreadDescription}
                    channelGuid={channelGuid as string} 
                    thread={true} 
                    onSend={message => sendThread(message)}
                  />
                </Box>
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
    height: ${props => `calc(calc(${props.true100vh}px - calc(var(--F_Header_Height) * 2)) - 1px)`};
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    overflow-y: auto;
    overflow-x: hidden;
    background: var(--F_Background_Alternating);
  `
}