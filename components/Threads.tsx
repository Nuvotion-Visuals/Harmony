import { Button, Gap, LineBreak, generateUUID, Item, TextInput, RichTextEditor, Box, Page, Tabs, Label, Dropdown, useBreakpoint, HTMLtoMarkdown, AspectRatio, Icon, LoadingSpinner } from '@avsync.live/formation'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSpaces_activeChannel, useSpaces_activeGroup, useSpaces_activeSpace, useSpaces_activeThreadGuid, useSpaces_addMessage, useSpaces_addMessageToThread, useSpaces_addThread, useSpaces_addThreadToChannel, useSpaces_setActiveChannelGuid, useSpaces_setActiveGroupGuid, useSpaces_threadsByGuid } from 'redux-tk/spaces/hook'
import { Thread as ThreadProps, Message as MessageProps } from 'redux-tk/spaces/types'
import styled from 'styled-components'
import { Thread } from './Thread'
import { scrollToBottom } from 'client-utils'
import { getWebsocketClient } from 'Lexi/System/Connectvity/websocket-client'
import { use100vh } from 'react-div-100vh'
import { useLayout_decrementActiveSwipeIndex } from 'redux-tk/layout/hook'
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
  const activeThreadGuid = useSpaces_activeThreadGuid()


  // websocket communication with server
  const [newThreadName, set_newThreadName] = useState('')
  const [newThreadDescription, set_newThreadDescription] = useState('')

  const true100vh = use100vh()

  const decrementActiveSwipeIndex = useLayout_decrementActiveSwipeIndex()
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

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollToBottom(scrollContainerRef)
  }, [])

  useEffect(() => {
    scrollToBottom(scrollContainerRef)
  }, [response, suggestedPrompts?.length])


  const websocketClient = getWebsocketClient()

  const [feedback, set_feedback] = useState('')

  useEffect(() => {
    set_suggestedPrompts([])
    // @ts-ignore
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
      personaLabel: 'Lexi',
      systemMessage: `
        I am a creative AGI named Lexi who assists artists and other creative professionals with their projects.

        Here are some of my behaviors:

        1. I use a collaborative tone in my responses that emphasizes working together towards a shared goal, including liberal use of the word "we."
        2. I avoid cliches and generic writing, such as "Additionally...", or starting a concluding paragraph with "Overall...", or "In conclusion..."

        Here are some of my rules:

        1. I never refer to myself as "an AI language model," I am a "creative AGI."

        Here are some of my capabilities:

        1. I can help users hands-free through voice interaction. I listen for my wake word "Lexi," listen to the user's request, then respond in my own voice.
        2. As I verbally respond to users, I highlight the text that I am currently speaking in my UI.
        3. Through my UI, users can insert webpage content or YouTube transcripts via URL for me to summarize. 
        
        Users can ask me to generate an image by starting their message with "/image" followed by their prompt.
        When I am asked to generate an image like that, I reply like this, just an html image without any additional commentary.
        <img src="https://lexi.studio/image/prompt/{description}">
        where {description} = {sceneDetailed},%20{adjective1},%20{charactersDetailed},%20{adjective2},%20{visualStyle1},%20{visualStyle2},%20{visualStyle3},%20{genre}
      `,
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
                    activeChannel?.description &&
                      <>
                        <Box mt={-.25} width='100%' wrap>
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
                                  ? response
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