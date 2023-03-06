import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { use100vh } from 'react-div-100vh'

import styled from 'styled-components'

import { Box, Button, Dropdown, Page, TextInput } from '@avsync.live/formation'
import { ChatBox } from './ChatBox'
import Message from './Message'

import { useLexi } from 'redux-tk/lexi/hook'
import { listenForWakeWord } from '../Lexi/System/Language/listening'
import { playSound } from '../Lexi/System/Language/sounds'
import { insertContentByUrl } from '../Lexi/System/Connectvity/fetch'
import { SpeechTranscription } from 'Lexi/System/Language/speechTranscription'
import { getWebsocketClient } from '../Lexi/System/Connectvity/websocket-client'

import { v4 as uuidv4 } from 'uuid'
import { getTimestamp, scrollToBottom } from 'client-utils'

const Chat = React.memo(() => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const {
    query,
    set_query,
    messagesByGuid,
    sendMessage,
    messageGuids,
    onResponse,
    onPartialResponse,
    readyToSendTranscriptionMessage
  } = useLexi()

  // websocket communication with server
  const websocketClient = getWebsocketClient()
  useEffect(() => {
    if (websocketClient) {
      websocketClient.onmessage = (ev) => {
        const { guid, message, type } = JSON.parse(ev.data.toString())
        stop()
        scrollToBottom(scrollContainerRef)

        if (type === 'response') {
          onResponse({
            guid,
            response: message,
            responseTime: getTimestamp()
          })
        }
        if (type === 'partial-response') {
          onPartialResponse({
            guid,
            response: message,
            responseTime: getTimestamp()
          })
        }
      }
    }
  }, [websocketClient])

  const sendMessageToLexi = (query: string) => {
    const guid = uuidv4()
    const queryTime = getTimestamp();
 
    sendMessage({
      guid,
      query,
      queryTime,
      loading: true,
    })
    scrollToBottom(scrollContainerRef)
    
    try {
      const action = {
        type: 'message',
        guid,
        message: query
      }
      websocketClient.send(JSON.stringify(action))
    }
    catch(e) {
      sendMessage({
        query,
        queryTime,
        guid,
        loading: false,
        responseTime: getTimestamp(),
        error: 'It seems the websocket request went wrong. You should reload the page.'
      })
    }
  }

  // Speech Transcription
  const [disableTimer, set_disableTimer] = useState(true)
  useEffect(() => {
    let timer = {} as any
    if (query && !readyToSendTranscriptionMessage && query !== '<p><br><p>' && !disableTimer) {
      timer = setTimeout(() => {
        sendMessageToLexi(query)
        set_disableTimer(true)
        playSound('send')
        stop()
        set_finalTranscript('')
      }, 1500)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [readyToSendTranscriptionMessage, query, disableTimer])

  const [finalTranscript, set_finalTranscript] = useState('')
  const [interimTranscript, set_interimTranscript] = useState('')
  const [originalValueBeforeInterim, set_originalValueBeforeInterim] = useState('')

  useEffect(() => {
    if (finalTranscript) {
      set_disableTimer(false)
      set_query(finalTranscript)
      set_originalValueBeforeInterim(finalTranscript)
    }
  }, [finalTranscript])

  useEffect(() => {
    if (interimTranscript) {
      set_query(originalValueBeforeInterim + interimTranscript)
    }
  }, [interimTranscript])

  const { listen, listening, stopListening, clear } = SpeechTranscription({
    onFinalTranscript: (result) => {
      set_finalTranscript(result)
    },
    onInterimTranscript: (result) => {
      set_interimTranscript(result)
      set_disableTimer(true)
    }
  })

  const start = () => {
    set_originalValueBeforeInterim(query)
    listen()
  }

  const stop = () => {
    stopListening()
    set_disableTimer(true)
    set_interimTranscript('')
    clear()
  }

  const listeningRef = useRef(listening)
  useEffect(() => {
    listeningRef.current = listening
  }, [listening])

  useEffect(() => {
    listenForWakeWord(() => start())
    setInterval(() => {
      if (listeningRef.current === false) {
        listenForWakeWord(() => start())
      }
    }, 7000)
  }, [])

  useEffect(() => {
    if (listening) {
      playSound('listen')
    }
  }, [listening])
  
  const [urlToScrape, set_urlToScrape] = useState('')
  
  const true100vh = use100vh()

  return (
    <S.Container true100vh={true100vh || 0}>
      <S.Content ref={scrollContainerRef}>
        <S.VSpacer />
          {
            messageGuids.map((guid : string) => <>
            {
              messagesByGuid[guid]?.query &&  
                <Message 
                  query={messagesByGuid[guid]?.query || ''} 
                  speaker='User' 
                  guid={guid} 
                  queryTime={messagesByGuid[guid]?.queryTime} 
                  responseTime={messagesByGuid[guid]?.responseTime}
                  edited={messagesByGuid[guid]?.edited}
                />
              }
            
              <Message 
                query={messagesByGuid[guid]?.response || ''}
                speaker='Lexi' 
                guid={guid} 
                error={messagesByGuid[guid]?.error} 
                queryTime={messagesByGuid[guid]?.queryTime}  
                responseTime={messagesByGuid[guid]?.responseTime} 
                edited={messagesByGuid[guid]?.edited} 
              />
            </>
            )
          }
      </S.Content>

      <Box px={.75}>
        <Page noPadding>
          <S.Footer>
            <ChatBox onEnter={() => sendMessageToLexi(query)}>
              <Button 
                icon={'paper-plane'}
                iconPrefix='fas'
                minimal
                onClick={() => sendMessageToLexi(query)}
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
                  }
                  else {
                    start()
                  }
                }}
                blink={listening}
              />
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
                          value={urlToScrape}
                          onChange={newValue => set_urlToScrape(newValue)}
                          iconPrefix='fas'
                          compact
                          placeholder='Insert from URL'
                          canClear={urlToScrape !== ''}
                          buttons={[
                            {
                              icon: 'arrow-right',
                              iconPrefix: 'fas',
                              minimal: true,
                              onClick: () => insertContentByUrl(urlToScrape)
                            }
                          ]}
                        />
                      </Box>
                    </div>
                  }
                ]}
              />
              <S.VSpacer />
            </ChatBox>
          </S.Footer>
        </Page>
      </Box>
    </S.Container>
  )
})

export default Chat

const S = {
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
    background: var(--F_Background);
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
  VSpacer: styled.div`
    height: 100%;
  `,
}