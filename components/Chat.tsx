import { useState, useEffect, useRef, useMemo } from 'react'

// @ts-ignore
import { useSpeechRecognition } from 'react-speech-kit'
// @ts-ignore
import { convert } from 'html-to-text'

import { v4 as uuidv4 } from 'uuid'
import { getWebsocketClient } from '../Lexi/System/Connectvity/websocket-client'
import { use100vh } from 'react-div-100vh'

import {
  Button,
  Box,
  Modal,
  TextInput,
  Spacer,
  stringInArray,
  Dropdown,
  RichTextEditor,
  useBreakpoint
} from '@avsync.live/formation'

import styled from 'styled-components'
import { useRouter } from 'next/router'
import Message from './Message'
import React from 'react'
import { speakStream } from '../Lexi/System/Language/speech'
import { listenForWakeWord } from '../Lexi/System/Language/listening'

import { playSound } from '../Lexi/System/Language/sounds'
import { getArticleContent, getYouTubeTranscript } from '../Lexi/System/Fetch/fetch'
import { useLexi } from 'redux-tk/lexi/hook'
import { ChatBox } from './ChatBox'

const Chat = React.memo(() => {
  const {
    query,
    set_query,
    messagesByGuid,
    sendMessage,
    messageGuids,
    onResponse,
    onPartialResponse,
    readyToSendTranscriptionMessage,
    set_readyToSendTranscriptionMessage,
    set_userInitialedListening
  } = useLexi()

  const true100vh = use100vh()

  // websocket communication with server
  const websocketClient = getWebsocketClient()
  useEffect(() => {
    if (websocketClient) {
      websocketClient.onmessage = (ev) => {
        const wsmessage = JSON.parse(ev.data.toString())
        // got complete response from server
        if (wsmessage.type === 'response') {
          stop()
        
          const { status, guid, type, message, queryTime } = wsmessage as any

          const responseTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})
          console.log('got a response')
          scrollToBottom()

          onResponse({
            guid,
            response: message,
            responseTime
          })

          listenForWakeWord(() => {
            listen()
          })
        }
        // got partial response from server
        if (wsmessage.type === 'partial-response') {
          stop()
          const { guid, message } = wsmessage as any

          const responseTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})

          onPartialResponse({
            guid,
            response: message,
            responseTime
          })
          scrollToBottom()

          speakStream(wsmessage.message, false)
        }
      }
    }
  }, [websocketClient])

  const scrollToBottom = () => {
    if (!!(scrollContainerRef.current as HTMLElement) && !!(scrollContainerRef.current as HTMLElement)) {
      (scrollContainerRef.current as HTMLElement).scrollTop = (scrollContainerRef.current as HTMLElement)?.scrollHeight
      setTimeout(() => {
        (scrollContainerRef.current as HTMLElement).scrollTop = (scrollContainerRef.current as HTMLElement)?.scrollHeight
      }, 1)
    }
  }

  const sendMessageToLexi = (query: string) => {
    const guid = uuidv4()
    const queryTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
 
    sendMessage({
      guid,
      query,
      queryTime,
      loading: true,
    })
    scrollToBottom()
    
    // send to server
    try {
      const action = {
        type: 'message',
        guid,
        message: query
      }
      websocketClient.send(JSON.stringify(action))
    }
    // failed to send to server
    catch(e) {
      const responseTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})
      sendMessage({
        query,
        queryTime,
        guid,
        loading: false,
        responseTime,
        error: 'It seems the websocket request went wrong. You should reload the page.'
      })

    }

  }

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const scrollToRef = useRef<HTMLDivElement | null>(null)

  // speech
  const [disableTimer, set_disableTimer] = useState(true)
  useEffect(() => {
    let timer = {} as any
    if (query && !readyToSendTranscriptionMessage && query !== '<p><br><p>' && !disableTimer) {
      timer = setTimeout(() => {
        sendMessageToLexi(query)
        set_readyToSendTranscriptionMessage(false)
        set_disableTimer(true)
        stop()
      }, 1000)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [readyToSendTranscriptionMessage, query, disableTimer])

  const router = useRouter()
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result : string) => {
      (async () => {
        if (!readyToSendTranscriptionMessage) {

          set_query(result)
          set_disableTimer(false)
        }
      })()
    },
  })

  useEffect(() => {
    scrollToBottom()
  }, [router.asPath])

  useEffect(() => {
    listenForWakeWord(() => {
      listen()
      console.log('Heard wake word')
    })
    setInterval(() => {
      listenForWakeWord(() => {
        listen()
        console.log('Heard wake word')
      })
    }, 8000)
  }, [])

  useEffect(() => {
    if (listening || readyToSendTranscriptionMessage) {
      playSound('listen')
    }
  }, [listening, readyToSendTranscriptionMessage])
  
  const [url, set_url] = useState('')

  const insertContentByUrl = () => {
    const youtubeDomains = ['www.youtube.com', 'youtube.com', 'youtu.be']

    const { hostname } = new URL(url);
    if (youtubeDomains.includes(hostname)) {
      getYouTubeTranscript(url,
        (transcript) => {
          set_query(query + '\n' + convert(transcript))
        },
        () => {
          alert('Could not get video transcript.')
        }
      )
    }
    else {
      getArticleContent(url, 
        (content) => {
          set_query(query + '\n' + convert(content))
        },
        () => {
          alert('Could not get page content.')
        }
      )
    }
  }

  
  return (
    <>
        <S.Container true100vh={true100vh || 0}>
          <S.Content ref={scrollContainerRef}>
            <S.VSpacer />
              
              <Box width='100%' wrap={true} mt={messageGuids.length > 0 ? .75 : 0}>
                <S.FlexStart>
                </S.FlexStart>
              </Box>
              {
                messageGuids.map((guid, index) => <>
                {
                  messagesByGuid[guid]?.query &&  
                  <Message 
                      query={messagesByGuid[guid]?.query || ''} 
                      speaker='User' 
                      guid={guid} 
                      queryTime={messagesByGuid[guid]?.queryTime} 
                      responseTime={messagesByGuid[guid]?.responseTime}
                    />
                  }
                
                  <Message 
                    query={messagesByGuid[guid]?.response || ''} 
                    speaker='Lexi' 
                    guid={guid} 
                    error={messagesByGuid[guid]?.error} 
                    queryTime={messagesByGuid[guid]?.queryTime}  
                    responseTime={messagesByGuid[guid]?.responseTime} 
                  />
                </>
                )
              }
            <div ref={scrollToRef}></div>
          </S.Content>

          <Box px={.75}>
            <S.AltPage>
            <S.Footer>
              <S.ButtonContainer>
                <Box>
                  <Dropdown
                    icon='plus'
                    iconPrefix='fas'
                    minimal
                    circle
                    items={[
                      {
                        children: <div onClick={e => e.stopPropagation()}>
                          <Box minWidth={13.5}>
                            <TextInput
                              value={url}
                              onChange={newValue => set_url(newValue)}
                              iconPrefix='fas'
                              compact
                              placeholder='Insert from URL'
                              canClear
                              buttons={[
                                {
                                  icon: 'arrow-right',
                                  iconPrefix: 'fas',
                                  minimal: true,
                                  onClick: () => {
                                    insertContentByUrl()
                                  }
                                }
                              ]}
                            />
                          </Box>
                        </div>,
                        onClick: () => {}
                      },
                      {
                        title: 'Done'
                      }
                    ]}
                  />
                
                  <Button 
                    icon={listening ? 'microphone-slash' : 'microphone'}
                    iconPrefix='fas'
                    circle={true}
                    minimal
                    onClick={() => {
                      if (listening) {
                        stop()
                        set_disableTimer(true)
                        set_userInitialedListening(false)
                      }
                      else {
                        listen()
                        set_readyToSendTranscriptionMessage(false)
                        set_userInitialedListening(true)
                      }
                    }}
                    blink={listening}
                  />
                  <Box pr={.5}>
                    <Button 
                      icon={'paper-plane'}
                      iconPrefix='fas'
                      minimal
                      onClick={() => sendMessageToLexi(query)}
                    />
                  </Box>
                </Box>
              
              </S.ButtonContainer>
              <ChatBox
                onEnter={() => {
                  sendMessageToLexi(query)
                }}
              />
            </S.Footer>
          </S.AltPage>
        </Box>
      </S.Container>
    </>
  )
})

export default Chat

const S = {
  Iframe: styled.iframe`
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    overflow: hidden;
    background: var(--F_Background_Alternating);
  `,
  Container: styled.div<{
    true100vh: number 
  }>`
    height: ${props => `calc(${props.true100vh}px - calc(1 * var(--F_Header_Height)))`};
    width: 100%;
    overflow: hidden;
    background: var(--F_Background);
  `,
  Content: styled.div`
    width: 100%;
    height: calc(calc(calc(100% - var(--L_Prompt_Height))) - 1.5rem);
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    background: var(--F_Background);
  `,
  AltPage: styled.div`
    max-width: 700px;
    width: 100%;
  `,
  Footer: styled.div`
    position:relative;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: var(--L_Prompt_Height);
    padding: var(--L_Prompt_Padding) 0;
    overflow-y: auto;
  `,
  ButtonContainer: styled.div`
    position: absolute;
    right: 1px;
    top: calc(var(--L_Prompt_Padding) + 1px);
    border-radius: .75rem;
    z-index: 1;
    background: var(--F_Background);
  `,
  FlexStart: styled.div<{
    wrap?: boolean
  }>`
    width: 100%;
    max-width: 700px;
    display: flex;
    align-items: flex-start;
    flex-wrap: ${props => props.wrap? 'wrap' : 'noWrap'};
    
  `,
  Center: styled.div<{
    isMobile?: boolean,
    isSidebarOpen?: boolean
  }>`
    left: ${props => 
      props.isMobile
        ? '14rem'
        : props.isSidebarOpen
            ? 'var(--F_Sidebar_Width_Expanded)'
            : '0'
    };
    position: absolute;
    width: ${props => 
      props.isMobile
        ? '14rem'
        : props.isSidebarOpen
            ? 'calc(100% - var(--F_Sidebar_Width_Expanded))'
            : '100%'
    };
    display: flex;
    justify-content: center;
    pointer-events: none;
  `,
  VSpacer: styled.div`
    width: 100%;
    height: 100%;
  `,
  Indicator: styled.div<{
    active?: boolean
  }>`
    width: .75rem;
    height: .75rem;
    background-color: ${props => props.active ? 'var(--F_Font_Color_Success)' : 'var(--F_Surface_1)'};
    animation: all 1s;
    margin: .75rem;
    margin-left: 0;
    border-radius: 100%;
  `
}