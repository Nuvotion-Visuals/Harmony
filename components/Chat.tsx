import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

// @ts-ignore
import { useSpeechRecognition } from 'react-speech-kit'
// @ts-ignore
import { convert } from 'html-to-text'

import { v4 as uuidv4 } from 'uuid'
import { getWebsocketClient } from '../Lexi/System/Connectvity/websocket-client'

import {
  Button,
  Navigation,
  Gap,
  Page,
  Box,
  LineBreak,
  Modal,
  TextInput,
  Spacer,
  AspectRatio,
  stringInArray,
  Dropdown,
  RichTextEditor
} from '@avsync.live/formation'

import styled from 'styled-components'
import { useRouter } from 'next/router'
import Message from './Message'
import React from 'react'
import { speakStream } from '../Lexi/System/Language/speech'
import { listenForWakeWord } from '../Lexi/System/Language/listening'

import { playSound } from '../Lexi/System/Language/sounds'
import { getArticleContent, getYouTubeTranscript } from '../Lexi/System/Fetch/fetch'

interface Queries {
  [guid: string]: {
    guid: string,
    query?: string,
    queryTime: string,
    response?: string,
    responseTime?: string,
    loading: boolean,
    error?: string,
    scriptName?: string
  }
}

interface Props {
  children: React.ReactNode
}

const Home = ({
  children
} :Props) => {
  function useExtendedState<T>(initialState: T) {
    const [state, setState] = useState<T>(initialState);

    const getLatestState = () => {
      return new Promise<T>((resolve, reject) => {
        setState((s) => {
          resolve(s);
          return s;
        });
      });
    };
  
    return [state, setState, getLatestState] as const;
  }

  const [queriesByGuid, set_queriesByGuid, getLatestQueriesByGuid] = useExtendedState<Queries>({})
  const [queryGuids, set_queryGuids, getLatestQueryGuids] = useExtendedState<string[]>([])

  const [loading, set_loading] = useExtendedState(true)

  const [query, set_query, getLatestQuery] = useExtendedState('')

  // websocket communication with server
  const websocketClient = getWebsocketClient()
  useEffect(() => {
    if (websocketClient) {
      websocketClient.onmessage = (ev) => {
        const wsmessage = JSON.parse(ev.data.toString())
        if (wsmessage.type === 'response') {
          stop()
        
          const { status, guid, type, message, queryTime } = wsmessage as any

          const responseTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})
          console.log('got a response')
          scrollToBottom()

          set_queryGuids([...queryGuids, guid])
          set_queriesByGuid(queriesByGuid => ({
            ...queriesByGuid,
            [guid]: {
              query: queriesByGuid[guid].query,
              queryTime: queriesByGuid[guid].queryTime,
              guid,
              loading: false,
              response: message,
              responseTime
            }
          }))

          listenForWakeWord(() => {
            listen()
          })
        }
        if (wsmessage.type === 'partial-response') {
          stop()
          const { status, guid, type, message, queryTime } = wsmessage as any

          const responseTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})

          set_queriesByGuid(queriesByGuid => ({
            ...queriesByGuid,
            [guid]: {
              query: queriesByGuid[guid].query,
              queryTime: queriesByGuid[guid].queryTime,
              guid,
              loading: false,
              response: message,
              responseTime
            }
          }))
          scrollToBottom()

          speakStream(wsmessage.message, false)
        }
        if (wsmessage.type === 'message') {
          stop()
          
          const { message, response, messageTime, responseTime, queryTime, scriptName } = wsmessage as any

          console.log('got a message')
          scrollToBottom()

          const guid = uuidv4();

          (async () => {
            const latestQueryGuids = await getLatestQueryGuids()

            set_queryGuids([...latestQueryGuids, guid])
            set_queriesByGuid(queriesByGuid => ({
              ...queriesByGuid,
              [guid]: {
                guid,
                loading: false,
                response,
                responseTime,
                messageTime,
                queryTime,
                scriptName
              }
            }))
          })()

          set_loading(false)
        }
      }
    }
  }, [websocketClient])

  const [initializedScriptNames, set_initializedScriptNames] = useState<(string | undefined)[]>([])
  useEffect(() => {
    const newInitializedScriptNames = queryGuids.filter(guid => queriesByGuid?.[guid]?.scriptName).map(guid => queriesByGuid?.[guid]?.scriptName?.replace(/-/g, ' '))
    console.log(newInitializedScriptNames)
    set_initializedScriptNames(newInitializedScriptNames)
  }, [queryGuids])

  const scrollToBottom = () => {
    if (!!(scrollContainerRef.current as HTMLElement) && !!(scrollContainerRef.current as HTMLElement)) {
      (scrollContainerRef.current as HTMLElement).scrollTop = (scrollContainerRef.current as HTMLElement)?.scrollHeight
      setTimeout(() => {
        (scrollContainerRef.current as HTMLElement).scrollTop = (scrollContainerRef.current as HTMLElement)?.scrollHeight
      }, 1)
    }
  }

  const makeQuery = (query: string) => {
    set_query('') // async so it's ok
    set_loading(true)
    scrollToBottom()

    const guid = uuidv4()
    const queryTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
    (async () => {
      const latestQueryGuids = await getLatestQueryGuids()
      set_queryGuids([...latestQueryGuids, guid])
      set_queriesByGuid({
        ...queriesByGuid,
        [guid]: {
          guid,
          query,
          queryTime,
          loading: true,
        }
      })
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
        const latestQueryGuids = await getLatestQueryGuids()
        set_queryGuids([...latestQueryGuids, guid])
        set_queriesByGuid({
          ...queriesByGuid,
          [guid]: {
            query,
            queryTime,
            guid,
            loading: false,
            responseTime,
            error: 'It seems the websocket request went wrong. You should reload the page.'
          }
        })
      }

      set_loading(false)
    })()
  }

  const queries = Object.keys(queriesByGuid).map(guid => queriesByGuid[guid]) 

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const scrollToRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollToBottom()
  }, [loading])

  // speech
  const [userInitiatedListen, set_userInitiatedListen, get_userInitialedListen] = useExtendedState(false)
  const [ready, set_ready, getLatestReady] = useExtendedState(false)
  const [disableTimer, set_disableTimer] = useState(true)
  useEffect(() => {
    let timer = {} as any
    if (query && !ready && query !== '<p><br><p>' && !disableTimer) {
      timer = setTimeout(() => {
        makeQuery(query)
        set_ready(false)
        set_disableTimer(true)
        stop()
      }, 1000)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [ready, query, disableTimer])

  const router = useRouter()
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result : string) => {
      (async () => {
        const latestReady = await getLatestReady()

        if (!latestReady) {
          set_query(query + result)
          set_disableTimer(false)
        }
      })()
    },
  })

  const [show, set_show] = useState(false) 
  useEffect(() => {
    scrollToBottom()
  }, [show])

  const [open, set_open] = useState(false)
  const [contentUrl, set_contentUrl] = useState('')
  const [videoUrl, set_videoURL] = useState('')

  const [sidebarOpen, set_sidebarOpen] = useState(false)

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
    if (listening || ready) {
      playSound('listen')
    }
  }, [listening, ready])
  
  const ScriptInitializedIndicator = ({ scriptName } : { scriptName: string}) => 
    <><Spacer /><S.Indicator active={initializedScriptNames.includes(scriptName)} title={`${queryGuids.includes(scriptName) ? 'Finished reading' : 'Have not read'} ${scriptName}`} /></>

  const [search, set_search] = useState('')
  const [url, set_url] = useState('')

  const submitSearch = () => {
    set_open(true)
  }

  const insertContentByUrl = () => {
    const youtubeDomains = ['www.youtube.com', 'youtube.com', 'youtu.be']

    const { hostname } = new URL(url);
    if (youtubeDomains.includes(hostname)) {
      getYouTubeTranscript(url,
        (transcript) => {
          set_query(query + '\n' + convert(transcript))
          set_open(false)
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
          set_open(false)
        },
        () => {
          alert('Could not get page content.')
        }
      )
    }
  }
  
  return (
    <>
  
        <S.Container>
          <S.Content ref={scrollContainerRef}>
            <S.VSpacer />
              <Page>
                <Box pb={.75}>
                  <div style={{borderRadius: '.75rem', width: '100%', overflow: 'hidden'}}>
                    <AspectRatio
                      ratio={21/9}
                      backgroundSrc='/assets/lexi-banner-2.png'
                      coverBackground={true}
                    />
                  </div>
                </Box>
              </Page>
              
              <Box width='100%' wrap={true} mt={queries.length > 0 ? .75 : 0}>
                <S.FlexStart>
                </S.FlexStart>
              </Box>
              {
                queries.map(({query, response, guid, error}, index) => <>
                {
                  queriesByGuid[guid].query &&  
                  <Message 
                      query={queriesByGuid[guid].query || ''} 
                      speaker='User' 
                      guid={guid} 
                      queryTime={queriesByGuid[guid].queryTime} 
                      responseTime={queriesByGuid[guid].responseTime}
                    />
                  }
                
                  <Message 
                    query={queriesByGuid[guid].response || ''} 
                    speaker='Lexi' 
                    guid={guid} 
                    error={error} 
                    queryTime={queriesByGuid[guid].queryTime}  
                    responseTime={queriesByGuid[guid].responseTime} 
                  />
                </>
                )
              }
           
            <Box hide={false} wrap={true} width='100%'>
              <Box width='100%' hide={!show}>
                {
                  router.route.includes('/apps') || stringInArray(router.route, [
                    '/framework',
                    '/projects',
                    '/characters',
                    '/entities',
                    '/realms',
                    '/people',
                    '/tasks',
                    '/stories',
                    '/scenes'
                  ])
                    ? children
                    : <S.AltPage>
                        {
                          children
                        }
                      </S.AltPage>
                }
               
              </Box>
             
              
            </Box>
            <div ref={scrollToRef}></div>
          </S.Content>

          <Box px={.75}>
            <S.AltPage>
            <S.Footer>
              <S.ButtonContainer>
                <Box>
                  <Button 
                    icon={'plus'}
                    iconPrefix='fas'
                    circle={true}
                    onClick={() => set_open(true)}
                  />
                
                  <Button 
                    icon={listening ? 'microphone-slash' : 'microphone'}
                    iconPrefix='fas'
                    circle={true}
                    onClick={() => {
                      if (listening) {
                        stop()
                        set_disableTimer(true)
                        set_userInitiatedListen(false)
                      }
                      else {
                        listen()
                        set_ready(false)
                        set_userInitiatedListen(true)
                      }
                    }}
                    blink={listening}
                  />
                  <Button 
                    icon='paper-plane'
                    text='Send'
                    onClick={() => makeQuery(query)}
                    disabled={loading && queryGuids.length !== 0}
                  />
                </Box>
              
              </S.ButtonContainer>
              <RichTextEditor
                value={query} onChange={(value : string) => set_query(value)} 
                height={'160px'}
                onEnter={newQuery => {
                  makeQuery(
                    newQuery.slice(0, -11), // remove unwanted linebreak
                  )
                }}
              />
            </S.Footer>
          </S.AltPage>
        </Box>
      </S.Container>
 
      <Modal 
        title='Search and Insert'
        icon='search'
        iconPrefix='fas'
        size='sm'
        isOpen={open}
        onClose={() => set_open(false)}
        content={
             
             <Box width='100%'>
              <TextInput 
                value={url}
                icon='link'
                iconPrefix='fas'
                onChange={newValue => set_url(newValue)}
                compact
              />
              <Button 
                icon='times'
                circle
                iconPrefix='fas'
                disabled={search === ''}
                onClick={() => set_url('')}
                minimal
              />
              <Button
                icon='plus'
                circle
                secondary
                iconPrefix='fas'
                onClick={() => {
                  insertContentByUrl()
                }
              }
              />
              
            </Box>
          
            
          
        }
  
      />
    </>
  )
}

export default Home

const S = {
  Iframe: styled.iframe`
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    overflow: hidden;
    background: var(--F_Background_Alternating);
  `,
  Container: styled.div`
    height: calc(calc(100vh - calc(1 * var(--F_Header_Height))) + 0rem);
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
    button {
      background: none;
    }
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