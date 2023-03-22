import { Button, Gap, LineBreak, generateUUID, Item, TextInput, RichTextEditor, Box, Page, Tabs, Label, Dropdown, useBreakpoint, HTMLtoMarkdown, AspectRatio, Icon, LoadingSpinner } from '@avsync.live/formation'
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
import { Indicator } from './Indicator'
import { useLanguageAPI } from 'Lexi/System/Language/hooks'
import { MatrixLoading } from './MatrixLoading'

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
    activeGroup,
    activeThread,
    activeThreadGuid
  } = useSpaces() 

  // websocket communication with server
  const [newThreadName, set_newThreadName] = useState('')
  const [newThreadDescription, set_newThreadDescription] = useState('')

  const true100vh = use100vh()

  const { decrementActiveSwipeIndex } = useLayout()
  const { isDesktop } = useBreakpoint()

  const selected = useMemo(() => activeGroup?.name && activeGroup?.name, [activeGroup]);


  
  const { language, response, loading, error, completed } = useLanguageAPI('');
  const { generateThreadPrompts } = language;
  
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
    if (activeChannel?.description && getWebsocketClient?.send) {
        generateThreadPrompts(`
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

  const [expandedThreads, setExpandedThreads] = useState<boolean[]>([]);
  const handleExpandClick = (index: number) => {
    setExpandedThreads(prevExpandedThreads => {
      const newExpandedThreads = [...prevExpandedThreads];
      newExpandedThreads[index] = !newExpandedThreads[index];
      return newExpandedThreads;
    });
  };

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollToBottom(scrollContainerRef)
  }, [])

  useEffect(() => {
    scrollToBottom(scrollContainerRef)
  }, [response, suggestedPrompts?.length])

  useEffect(() => {
    if (activeThreadGuid) {
     const targetIndex = activeChannel!.threadGuids.findIndex(item => item === activeThreadGuid)
     setExpandedThreads(prevExpandedThreads => {
      const newExpandedThreads = [...prevExpandedThreads];
      newExpandedThreads[targetIndex] = true;
      return newExpandedThreads;
    });
    }
  }, [activeThreadGuid])

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
            <S.Threads ref={scrollContainerRef} true100vh={true100vh || 0}>
              <Page noPadding>
                <Gap>
                  {
                    activeChannel?.previewSrc &&
                    <Box px={.75} width='100%'>
                      <S.ThreadPoster>
                        
                        <AspectRatio
                          backgroundSrc={activeChannel?.previewSrc}
                          ratio={2}
                          coverBackground
                        />
                      </S.ThreadPoster>
                    </Box>
                  }
                  {
                    activeChannel?.description &&
                      <>
                        <Box mt={-.25} width='100%' wrap>
                          
                         
                          <Item icon='hashtag' minimalIcon pageTitle={activeChannel?.name}>
                            <Indicator
                              count={activeChannel?.threadGuids?.length}
                            />
                            <Dropdown
                              icon='ellipsis-h'
                              iconPrefix='fas'
                              minimal
                              items={[
                                {
                                  icon: 'bolt-lightning',
                                  name: 'Suggest threads',
                                  onClick: () => {
                                    generateThreadPrompts(`
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
                          <Box width={'100%'}  wrap>
                  
                  {
                              suggestedPrompts?.length && !loading
                                ? <Box width='100%' >
                                    <Gap>
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
                                  </Box>
                                : loading
                                  ? <MatrixLoading
                                      text={response || ''}
                                    />
                                  : null
                            }
  
                            
                                <Box pb={.25} width='100%'>
                                {
                              !loading &&
                              <Box width='100%'>
                                <Gap disableWrap>
                                  <TextInput
                                    value={feedback}
                                    canClear={feedback !== ''}
                                    compact
                                    onChange={val => set_feedback(val)}
                                    placeholder='Suggest new threads'
                                    hideOutline
                                  />
                                  <Box minWidth={7}>
                                    <MatrixLoading >
                                    
                                      <Button
                                        icon='bolt-lightning'
                                        expand
                                        iconPrefix='fas'
                                        minimal
                                        text='Auto'
                                        onClick={() => generateThreadPrompts(`
                                        Space name: ${activeSpace?.name}
                                        Space description: ${activeSpace?.description}
                                        
                                        Channel name: ${activeChannel?.name}
                                        Channel description: ${activeChannel?.description} 
                                        
                                        Existing threads: \n${existingThreads}
                                        
                                        Your previous suggestions (optional): ${suggestedPrompts}
                                                        
                                        User feedback (optional): ${feedback}
                                        `)}
                                      />
  
                                    </MatrixLoading>
                                  </Box>
  
                                </Gap>
                              </Box>
                            }
  
                          </Box>
                         
                  </Box>
                      </>
                  }
                </Gap>
                
                {
                  activeChannel?.threadGuids?.map((threadGuid, index) => (
                    <React.Fragment key={threadGuid}>
                      <Thread
                        {
                          ...threadsByGuid[threadGuid]
                        }
                        expanded={expandedThreads?.[index]}
                        onExpand={() => handleExpandClick(index)}
                        threadGuid={threadGuid}
                      />
                    </React.Fragment>
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
    margin-top: .75rem;
  `
}