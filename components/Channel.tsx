import { Box, Button, Dropdown, generateUUID, Item, Page, RichTextEditor, Spacer, TextInput, useBreakpoint } from '@avsync.live/formation'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { use100vh } from 'react-div-100vh'
import { useLayout } from 'redux-tk/layout/hook'
import { useSpaces } from 'redux-tk/spaces/hook'
import styled from 'styled-components'
import { Indicator } from './Indicator'
import { Threads } from './Threads'

import { listenForWakeWord } from '../Lexi/System/Language/wakeWord'
import { playSound } from '../Lexi/System/Language/soundEffects'
import { insertContentByUrl } from '../Lexi/System/Connectvity/fetch'
import { SpeechTranscription } from 'Lexi/System/Language/speechTranscription'
import { getWebsocketClient } from '../Lexi/System/Connectvity/websocket-client'

import { Message as MessageProps, Thread as ThreadProps } from 'redux-tk/spaces/types'

interface Props {
  
}

export const Channel = ({ }: Props) => {
  const router = useRouter()
  const { channelGuid } = router.query
  const true100vh = use100vh()

  const [height, setHeight] = useState(160);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (componentRef.current) {
        setHeight(componentRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [message, set_message] = useState('')

  useEffect(() => {
    if (componentRef.current) {
      setHeight(componentRef.current.clientHeight);
    }
  }, [message])

  const { isDesktop } = useBreakpoint()
  const { decrementActiveSwipeIndex } = useLayout()

  const [urlToScrape, set_urlToScrape] = useState('')

  const {
    activeChannel,
    activeSpace,
    activeGroup,
    addMessage,
    addThread,
    addMessageToThread,
    addThreadToChannel,
    threadsByGuid,
    activeThreadGuid,
    setActiveThreadGuid,
    messagesByGuid
  } = useSpaces()

  const [query, set_query] = useState('')

  const [newThreadName, set_newThreadName] = useState('')
  const [newThreadDescription, set_newThreadDescription] = useState('')

  const sendMessageToThread = (message: string) => {
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
        personaLabel: 'Lexi',
        systemMessage: `
        Users can ask me to generate an image by starting their message with "/image" followed by their prompt.
        When I am asked to generate an image like that, I reply like this, just an html image without any additional commentary.
        <img src="https://lexi.studio/image/prompt/{description}">
        where {description} = {sceneDetailed},%20{adjective1},%20{charactersDetailed},%20{adjective2},%20{visualStyle1},%20{visualStyle2},%20{visualStyle3},%20{genre}
        `,
        userLabel: 'User',
      }
      websocketClient.send(JSON.stringify(action))
  
      // insert new message in anticipation of response
      const responseGuid = generateUUID()
      const newResponse ={
        guid: responseGuid,
        message: '',
        userLabel: 'Lexi'
      } as MessageProps
      addMessage({ guid: responseGuid, message: newResponse })
      addMessageToThread({ threadGuid: activeThreadGuid || '', messageGuid: responseGuid })
      set_query('')
      if (componentRef.current) {
        setHeight(componentRef.current.clientHeight);
      }

      const target = document.getElementById(`bottom_${activeThreadGuid}`)
      if (target) {
        target.scrollIntoView({
          behavior: "smooth", // "auto" or "smooth"
          block: "end", // "start", "center", "end", or "nearest"
          inline: "nearest" // "start", "center", "end", or "nearest"
        });
      }
    }

  const sendThread = (message: string) => {
    const websocketClient = getWebsocketClient()
    const guid = generateUUID()

    // add thread
    const newThread = {
      guid,
      name: newThreadName,
      channelGuid,
      messageGuids: [],
      description: newThreadDescription
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
      userLabel: 'Lexi'
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
      personaLabel: 'Lexi',
      systemMessage: `
      Users can ask me to generate an image by starting their message with "/image" followed by their prompt.
      When I am asked to generate an image like that, I reply like this, just an html image without any additional commentary.
      <img src="https://lexi.studio/image/prompt/{description}">
      where {description} = {sceneDetailed},%20{adjective1},%20{charactersDetailed},%20{adjective2},%20{visualStyle1},%20{visualStyle2},%20{visualStyle3},%20{genre}
      `,
      userLabel: 'User',
    }
    websocketClient.send(JSON.stringify(action))

    set_query('')
    if (componentRef.current) {
      setHeight(componentRef.current.clientHeight);
    }
    setTimeout(() => {
      const target = document.getElementById(`bottom_${guid}`)
      if (target) {
        target.scrollIntoView({
          behavior: "smooth", // "auto" or "smooth"
          block: "end", // "start", "center", "end", or "nearest"
          inline: "nearest" // "start", "center", "end", or "nearest"
        });
      }
    }, 100)
  }

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

  const handleClickBottom = () => {
    const target = document.getElementById(`bottom_channel`)
    if (target) {
      target.scrollIntoView({
        behavior: "smooth", // "auto" or "smooth"
        block: "end", // "start", "center", "end", or "nearest"
        inline: "nearest" // "start", "center", "end", or "nearest"
      });
    }
  }
  
  const [focus, set_focus] = useState(false)

  useEffect(() => {
    if (componentRef.current) {
      setHeight(componentRef.current.clientHeight);
    }
    set_focus(true)
  }, [activeThreadGuid])

  return (<S.Channel true100vh={true100vh || 0}>
    <Box height='var(--F_Header_Height)' width={'100%'}>

      <Item
        icon='hashtag'
        minimalIcon
      >
        <Item
          subtitle={`${activeSpace?.name} > ${activeGroup?.name} > ${activeChannel?.name}`}
          onClick={() => {
            if (!isDesktop) {
              decrementActiveSwipeIndex()
            }
          }}
        />
        
        <Button
          icon='chevron-down'
          iconPrefix='fas'
          minimal
          onClick={() => {
            handleClickBottom()
          }}
        />
        <Indicator
          count={activeChannel?.threadGuids?.length}
        />
        <Dropdown
          icon='ellipsis-h'
          iconPrefix='fas'
          minimal
          items={[
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
    </Box>

    <S.Content height={height}>
      <Threads />
      <div id='bottom_channel' />
    </S.Content>

    <S.Bottom ref={componentRef}>
      <Page noPadding>
        {
          activeThreadGuid &&
            <S.Reply>
              <Item
                icon='reply'
                minimalIcon
                subtitle={` ${threadsByGuid?.[activeThreadGuid || '']?.name}`}
                onClick={() => {
                  setTimeout(() => {
                    const target = document.getElementById(`top_${activeThreadGuid}`)
                    if (target) {
                      target.scrollIntoView({
                        behavior: "smooth", // "auto" or "smooth"
                        block: "start", // "start", "center", "end", or "nearest"
                        inline: "nearest" // "start", "center", "end", or "nearest"
                      });
                    }
                  }, 100)
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
      <Box p={.5}>
        <Page noPadding>
          <RichTextEditor
            key='testley'
            value={query} 
            onChange={(value : string) => value === '<p><br></p>' ? null : set_query(value)} 
            onEnter={() => {
              send(query.substring(0, query.length - 11)) // trim off <p><br></p>
            }}
            placeholder='Chat'
            outset
            autoFocus
          >
            <Button 
              icon={'paper-plane'}
              iconPrefix='fas'
              minimal
              onClick={() => send(query)}
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
                            onClick: () => insertContentByUrl(urlToScrape, content => set_query(oldQuery => `${oldQuery}\n${content}`))
                          }
                        ]}
                      />
                    </Box>
                  </div>
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
                }
                else {
                  start()
                }
              }}
              blink={listening}
            />
          </RichTextEditor>
        </Page>
      </Box>
    </S.Bottom>
  </S.Channel>)
}

const S = {
  Channel: styled.div<{
    true100vh: number
  }>`
    height: ${props => `calc(calc(${props.true100vh}px - calc(var(--F_Header_Height) * 2)) - 2px)`};
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    background: var(--F_Background_Alternating);

  `,
  Content: styled.div<{
    height: number
  }>`
    height: ${props => `calc(100% - ${props.height}px)`};
    width: 100%;
    overflow-y: auto;
  `,
  Bottom: styled.div`
    height: auto;
    max-height: 160px;
    background: var(--F_Background_Alternating);
    width: 100%;
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