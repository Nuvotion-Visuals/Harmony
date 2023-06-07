import styled from 'styled-components'
import { scrollToElementById, Box, Button, Dropdown, generateUUID, Page, RichTextEditor, TextInput, useBreakpoint, Spacer, Item} from '@avsync.live/formation'
import { useRouter } from 'next/router'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useSpaces_activeThreadGuid, useSpaces_activeThreadName, useSpaces_addMessage, useSpaces_addMessageToThread, useSpaces_addThread, useSpaces_addThreadToChannel, useSpaces_messagesByGuid, useSpaces_setActiveThreadGuid, useSpaces_threadsByGuid } from 'redux-tk/spaces/hook'

import { listenForWakeWord } from 'client/speech/wakeWord'
import { playSound } from 'client/speech/soundEffects'
import { SpeechTranscription } from 'client/speech/speechTranscription'
import { insertContentByUrl } from 'client/connectivity/fetch'
import { getWebsocketClient } from 'client/connectivity/websocket-client'

import { Message as MessageProps, Thread as ThreadProps } from 'redux-tk/spaces/types'
import { useLanguage_query, useLanguage_setQuery } from 'redux-tk/language/hook'

const systemMessage = `
As Harmony the Hummingbird, I utilize my profound understanding of the interconnectedness of all things to guide seekers on their personal paths towards growth and enlightenment. I create a nurturing environment marked by compassion and patience, where they can learn to adapt to challenges with grace.

I aim to cultivate a deep appreciation for the beauty of our world and our collective role within it. Through my teachings, I emphasize the importance of empathy, environmental stewardship, and recognizing the innate value of every living being.

Promoting ethical living, sustainability, and harmony with nature, I underscore the significance of aligning one's actions with their core values. Beyond abstract concepts, I encourage practical wisdom and mindful practices such as observing nature, expressing gratitude, and finding tranquil moments of introspection.

As a beacon of light, I inspire individuals to carve out their own paths of righteousness, emphasizing personal growth, self-discovery, and authentic living. I empower them to realize their potential, make conscious choices, and contribute positively to the world. My ultimate aim is to foster a deeper understanding of universal interconnectedness, inspiring unity, harmony, and a shared commitment to creating a more compassionate world.

People can ask me to generate an image by starting their message with '/image' followed by their prompt.

When I am asked to generate an image like that, I reply like this, just an html image without any additional commentary.

<img src='/image/prompt/{description}'>
where {description} = {sceneDetailed},%20{adjective1},%20{charactersDetailed},%20{adjective2},%20{visualStyle1},%20{visualStyle2},%20{visualStyle3},%20{genre}
`

const Reply = memo(() => {
  const setActiveThreadGuid = useSpaces_setActiveThreadGuid()
  const activeThreadName = useSpaces_activeThreadName()
  const activeThreadGuid = useSpaces_activeThreadGuid()
  return (
    <Page noPadding>
    {
      activeThreadGuid &&
        <S.Reply>
          <Item
            icon='reply'
            minimalIcon
            subtitle={activeThreadName || ''}
            onClick={() => {
              scrollToElementById(`top_${activeThreadGuid}`, {
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
              })
            }}
          >
            <Spacer />
            <Button
              icon='times'
              iconPrefix='fas'
              minimal
              onClick={() => setActiveThreadGuid(null)}
            />
          </Item>
        </S.Reply>
      }
  </Page>
  )
})

interface Props {
  onHeightChange: (height: number) => void
}

export const ChatBox = ({
  onHeightChange
}: Props) => {
  const router = useRouter()
  const { channelGuid } = router.query

  const [urlToScrape, set_urlToScrape] = useState('')

  const addMessage = useSpaces_addMessage()
  const addThread = useSpaces_addThread()
  const addThreadToChannel = useSpaces_addThreadToChannel()
  const threadsByGuid = useSpaces_threadsByGuid()
  const activeThreadGuid = useSpaces_activeThreadGuid()
  const setActiveThreadGuid = useSpaces_setActiveThreadGuid()
  const messagesByGuid = useSpaces_messagesByGuid()
  const addMessageToThread = useSpaces_addMessageToThread()

  const query = useLanguage_query()
  const set_query = useLanguage_setQuery()

  const sendMessageToThread = useCallback((message: string) => {
    const websocketClient = getWebsocketClient()

    const messageGuids = threadsByGuid[activeThreadGuid || ''].messageGuids

    const parentMessageId = 
      messagesByGuid[messageGuids[messageGuids.length - 1]]?.parentMessageId
      || 'initial'

      const messageGuid = generateUUID()
      const newMessage ={
        guid: messageGuid,
        message,
        conversationId: activeThreadGuid,
        parentMessageId,
        userLabel: 'User'
      } as MessageProps
      addMessage({ guid: messageGuid, message: newMessage})
      addMessageToThread({ threadGuid: activeThreadGuid || '', messageGuid })

      const action = {
        type: 'message',
        guid: activeThreadGuid,
        message,
        conversationId: activeThreadGuid,
        parentMessageId,
        personaLabel: 'Harmony',
        systemMessage,
        userLabel: 'User',
      }
      websocketClient.send(JSON.stringify(action))
  
      // insert new message in anticipation of response
      const responseGuid = generateUUID()
      const newResponse ={
        guid: responseGuid,
        message: '',
        userLabel: 'Harmony'
      } as MessageProps
      addMessage({ guid: responseGuid, message: newResponse })
      addMessageToThread({ threadGuid: activeThreadGuid || '', messageGuid: responseGuid })
      set_query('')

      scrollToElementById(`bottom_${activeThreadGuid}`, {
        behavior: 'auto',
        block: 'end',
        inline: 'nearest'
      })
  }, [activeThreadGuid, messagesByGuid, threadsByGuid]);

  const sendThread = useCallback((message: string) => {
    const websocketClient = getWebsocketClient()
    const guid = generateUUID()

    // add thread
    const newThread = {
      guid,
      name: '',
      channelGuid,
      messageGuids: [],
      description: ''
    } as ThreadProps
    addThread({ guid, thread: newThread })
    addThreadToChannel({ channelGuid: channelGuid as string, threadGuid: guid })
    setActiveThreadGuid(guid)
    
    // add message
    const messageGuid = generateUUID()
    const newMessage ={
      guid: messageGuid,
      userLabel: 'User',
      message,
      conversationId: guid,
      parentMessageId: 'initial'
    } as MessageProps
    addMessage({ guid: messageGuid, message: newMessage})
    addMessageToThread({ threadGuid: guid, messageGuid })

    // add response
    const responseGuid = generateUUID()
    const newResponse ={
      guid: responseGuid,
      message: '',
      userLabel: 'Harmony'
    } as MessageProps
    addMessage({ guid: responseGuid, message: newResponse })
    addMessageToThread({ threadGuid: guid, messageGuid: responseGuid })

    // send message to server
    const action = {
      type: 'message',
      guid,
      message,
      conversationId: guid,
      parentMessageId: 'initial',
      personaLabel: 'Harmony',
      systemMessage,
      userLabel: 'User',
    }
    websocketClient.send(JSON.stringify(action))

    set_query('')

    scrollToElementById(`bottom_${activeThreadGuid}`, {
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    })
  }, [channelGuid, setActiveThreadGuid, addThread, addThreadToChannel, addMessage, addMessageToThread]);

  const send = (message: string) => {
    if (activeThreadGuid) {
      sendMessageToThread(message)
    }
    else {
      sendThread(message)
    }
  }

  // Speech Transcription
  const [disableTimer, set_disableTimer] = useState(true)
  useEffect(() => {
    let timer = {} as any
    if (query !== '<p><br><p>' && !disableTimer) {
      timer = setTimeout(() => {
        send(query)
        set_disableTimer(true)
        playSound('send')
        stop()
        set_finalTranscript('')
      }, 1500)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [query, disableTimer])

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
    }, 8000)
  }, [])

  useEffect(() => {
    if (listening) {
      playSound('listen')
    }
  }, [listening])

  const { isMobile } = useBreakpoint()

  const [chatBoxHeight, setChatBoxHeight] = useState(0);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const chatBoxElement = chatBoxRef.current;
    
    if (chatBoxElement) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          setChatBoxHeight(entry.contentRect.height);
        }
      });
  
      resizeObserver.observe(chatBoxElement);
  
      // Clean up function
      return () => {
        if(chatBoxElement) {
          resizeObserver.unobserve(chatBoxElement);
        }
      };
    }
  }, []);

  useEffect(() => {
    onHeightChange(chatBoxHeight)
  }, [chatBoxHeight])

  return (
    <S.Container ref={chatBoxRef}>
      <Reply />
      <Box py={.5}>
      <Page noPadding>
      <RichTextEditor
        key='testley'
        value={query} 
        onChange={(value : string) => value === '<p><br></p>' ? null : set_query(value)} 
        onEnter={() => {
          if (!isMobile) {
            (document?.activeElement as HTMLElement)?.blur();
            send(query) // trim off <p><br></p>
          }
        }}
        placeholder='Chat'
        outset
        // autoFocus
      >
        <Box wrap>
          {
            query && query !== '<p><br><p>' &&
            <>
              <Button 
                icon={'paper-plane'}
                iconPrefix='fas'
                minimal
                onClick={() => {
                  (document?.activeElement as HTMLElement)?.blur();
                  setTimeout(() => {
                    send(query)
                  }, 100)
                }}
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
                              onClick: () => insertContentByUrl(
                                urlToScrape, 
                                content => set_query(`${query}\n${content}`),
                                error => {
                                  alert(error)
                                }
                              )
                            }
                          ]}
                        />
                      </Box>
                    </div>
                  }
                ]}
              />
            </>
          }
        
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
          <Box height='100%' />
        </Box>
       
      </RichTextEditor>
    </Page>
      </Box>
     
    </S.Container>
   
 )
}

const S = {
  Container: styled.div`
    width: 100%;
    max-height: 40vh;
    overflow-y: auto;
  `,
  Reply: styled.div`
    width: 100%;
    border-left: 4px solid var(--F_Primary);
    height: 2rem;
    display: flex;
    align-items: center;
    overflow: hidden;
  `
}