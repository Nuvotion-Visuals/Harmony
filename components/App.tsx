import { useState, useEffect, useRef, memo, Suspense } from 'react'
import axios from 'axios'
import { customAlphabet } from 'nanoid'
// @ts-ignore
import { useSpeechRecognition } from 'react-speech-kit'
// @ts-ignore
import { convert } from 'html-to-text'

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
const nanoid = customAlphabet(alphabet, 11)

import { getWebsocketClient, reconnect } from '../Lexi/System/Connectvity/websocket-client'

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
  useBreakpoint,
  AspectRatio,
  stringInArray,
  Dropdown
} from '@avsync.live/formation'

import styled from 'styled-components'
import { useRouter } from 'next/router'
import Message from './Message'
import React from 'react'
import { speak } from '../Lexi/System/Language/speech'
import { listenForWakeWord } from '../Lexi/System/Language/listening'

import { playSound } from '../Lexi/System/Language/sounds'

import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@avsync.live/formation').then(module => module.RichTextEditor), {
  ssr: false,
})

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

  const websocketClient = getWebsocketClient()

  useEffect(() => {
    if (websocketClient) {
      // recieve a web socket message from the client
      websocketClient.onmessage = (ev) => {
        const wsmessage = JSON.parse(ev.data.toString())
        if (wsmessage.type === 'response') {
          stop()
          speak(wsmessage.message, () => {
            set_disableTimer(true)
          })
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
        if (wsmessage.type === 'message') {
          stop()
          speak(wsmessage.response, () => {
            set_disableTimer(true)
          })
          const { message, response, messageTime, responseTime, queryTime, scriptName } = wsmessage as any

          console.log('got a message')
          scrollToBottom()

          const guid = nanoid();

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
      (scrollContainerRef.current as HTMLElement).scrollTop = (scrollContainerRef.current as HTMLElement).scrollHeight
      setTimeout(() => {
        (scrollContainerRef.current as HTMLElement).scrollTop = (scrollContainerRef.current as HTMLElement).scrollHeight
      }, 1)
    }
  }

  const makeQuery = (query: string, initialize: boolean) => {
    set_query('') // async so it's ok
    set_loading(true)
    scrollToBottom()

    const guid = nanoid()
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

  const getArticleTranscript = () => {
    (async () => {
      try {

        const getArticleTranscriptRes = await axios({
          method: 'POST',
          url: '/tools/parse-article',
          data: {
            contentUrl
          }
        })
        const { status, data } = getArticleTranscriptRes
        
        if (status === 200) {
          set_query(query + '\n' + convert(data.data.article.content))
          set_open(false)
        }
        else {
          alert('Could not get article transcript.')
        }
      }
      catch(e) {
        alert('Could not get article transcript.')
      }

      set_loading(false)
    })()
  }

  const getYouTubeTranscript = () => {
    (async () => {
      try {
        const getYouTubeTranscriptRes = await axios({
          method: 'POST',
          url: '/tools/parse-youtube-video',
          data: {
            videoUrl
          }
        })
        const { status, data } = getYouTubeTranscriptRes
        
        if (status === 200 && data?.data?.transcript) {
          set_query(query + '\n' + convert(data.data.transcript))
          set_open(false)
        }
        else {
          alert('Could not get YouTube transcript.')
        }
      }
      catch(e) {
        alert('Could not get article transcript.')
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

  const [ready, set_ready, getLatestReady] = useExtendedState(false)
  const [disableTimer, set_disableTimer] = useState(true)
  useEffect(() => {
    let timer = {} as any
    if (query && !ready && query !== '<p><br><p>' && !disableTimer) {
      timer = setTimeout(() => {
        set_ready(true)
      }, 2000)
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
        const latestQuery = await getLatestQuery()

        if (latestReady) {
          if (result.trim() === 'send' || result.trim() === 'set') {
            console.log('send')
            makeQuery(latestQuery, false)
            set_disableTimer(true)
            playSound('send')
            stop()
          }
          if (result.trim() === 'clear') {
            console.log('clear')
            set_query('')
            stop()
            setTimeout(() => {
              listen()
            }, 500)
          }
          set_ready(false)
        }
        else {
          set_ready(false)
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

  const [sidebarOpen, set_sidebarOpen] = useState(true)
  const { isMobile, isTablet } = useBreakpoint()

  useEffect(() => {
    scrollToBottom()
  }, [router.asPath])

  useEffect(() => {
    const handleClick = () => {
      listenForWakeWord(() => {
        listen()
        speak('', () => {})
        console.log('Heard wake word')
      })
    }
    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  })

  useEffect(() => {
    if (listening || ready) {
      playSound('listen')
    }
  }, [listening, ready])
  
  const ScriptInitializedIndicator = ({ scriptName } : { scriptName: string}) => 
    <><Spacer /><S.Indicator active={initializedScriptNames.includes(scriptName)} title={`${queryGuids.includes(scriptName) ? 'Finished reading' : 'Have not read'} ${scriptName}`} /></>

  const [initialized, set_initialized] = useState(false)

  return (
    <div>
      <Navigation
        navLogoSrc={'/assets/lexi-typography.svg'}
        open={sidebarOpen}
        onSetOpen={isSidebarOpen => set_sidebarOpen(isSidebarOpen)}
        navChildren={<>
          <S.Center isMobile={isMobile || isTablet} isSidebarOpen={sidebarOpen} >
            <Box width='100%' maxWidth='700px'>

            {/* <TextInput 
              value={contentUrl}
              onChange={newValue => set_contentUrl(newValue)}
              icon='search'
              iconPrefix='fas'
              compact={true}
            /> */}
            </Box>

          </S.Center>
          <Spacer />
          <Gap autoWidth>
          <Dropdown
          options={[
            {
              "icon": "gear",
              "iconPrefix": "fas",
              "dropDownOptions": [
                {
                  "icon": "fingerprint",
                  iconPrefix: 'fas',
                  "text": "Identity"
                },
                {
                  "icon": "palette",
                  iconPrefix: 'fas',
                  "text": "Appearance"
                },
                {
                  "icon": "volume-high",
                  "iconPrefix": "fas",
                  "text": "Sound"
                }
              ]
            }
          ]}
       />
          {
            router.route !== 'login' && 
              <Box mr={.75}>
                <Button
                  text='Sign out'
                  onClick={() => router.push('/login')}
                  secondary={true}
                />
              </Box>
            }
          </Gap>
         
        </>}
        navs={[
          {
            type: 'nav',
            name: 'Chat',
            icon: 'message',
            href: '/',
            active: router.asPath === '/'
          },
          {
            type: 'nav',
            name: 'Projects',
            icon: 'bookmark',
            href: '/projects',
            active: router.asPath === '/projects'
          },
          {
            type: 'nav',
            name: 'Tasks',
            icon: 'check-square',
            href: '/tasks',
            active: router.asPath === '/tasks'
          },
          {
            type: 'nav',
            name: 'People',
            icon: 'users',
            href: '/people',
            active: router.asPath === '/people'
          },
          {
            type: 'nav',
            name: 'Characters',
            icon: 'people-arrows',
            href: '/characters',
            active: router.asPath === '/characters'
          },
          {
            type: 'nav',
            name: 'Entities',
            icon: 'shapes',
            href: '/entities',
            active: router.asPath === '/entities'
          },
          {
            type: 'nav',
            name: 'Stories',
            icon: 'book',
            href: '/stories',
            active: router.asPath === '/stories'
          },
          {
            type: 'nav',
            name: 'Scenes',
            icon: 'film',
            href: '/scenes',
            active: router.asPath === '/scenes'
          },
          {
            type: 'nav',
            name: 'Realms',
            icon: 'door-open',
            href: '/realms',
            active: router.asPath === '/realms'
          },
          {
            type: 'title',
            title: 'Guide',
          },
          {
            type: 'nav',
            name: 'Theory',
            icon: 'flask',
            href: '/guide/theory',
            active: router.asPath === '/guide/theory'
          },
          {
            type: 'nav',
            name: 'How to script',
            icon: 'scroll',
            href: '/guide/how-to-script',
            active: router.asPath === '/guide/how-to-script'
          },
          {
            type: 'nav',
            name: 'Recipes',
            icon: 'book',
            href: '/guide/recipes',
            active: router.asPath === '/guide/recipes'
          },
          {
            type: 'nav',
            name: 'FAQ',
            icon: 'question',
            href: '/guide/faq',
            active: router.asPath === '/guide/faq'
          },
          {
            type: 'title',
            title: 'Scripts',
          },
          {
            type: 'nav',
            name: 'Identity',
            href: `/scripts/identity`,
            icon: 'fingerprint',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/identity',
            children: <ScriptInitializedIndicator scriptName='Identity' />
          },
          {
            type: 'nav',
            name: 'Capabilities',
            href: `/scripts/capabilities`,
            icon: 'brain',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/capabilities',
            children: <ScriptInitializedIndicator scriptName='Capabilities' />
          },
          {
            type: 'nav',
            name: 'Behavior',
            href: `/scripts/behavior`,
            icon: 'puzzle-piece',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/behavior',
            children: <ScriptInitializedIndicator scriptName='Behavior' />
          },
          {
            type: 'nav',
            name: 'Purpose',
            href: `/scripts/purpose`,
            icon: 'compass',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/purpose',
            children: <ScriptInitializedIndicator scriptName='Purpose' />
          },
          {
            type: 'nav',
            name: 'Specialization',
            href: `/scripts/specialization`,
            icon: 'graduation-cap',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/specialization',
            children: <ScriptInitializedIndicator scriptName='Specialization' />
          },
          {
            type: 'nav',
            name: 'Goals',
            href: `/scripts/goals`,
            icon: 'bullseye',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/goals',
            children: <ScriptInitializedIndicator scriptName='Goals' />
          },
          {
            type: 'nav',
            name: 'Personality',
            href: `/scripts/personality`,
            icon: 'masks-theater',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/personality',
            children: <ScriptInitializedIndicator scriptName='Personality' />
          },
          {
            type: 'nav',
            name: 'Communication',
            href: `/scripts/communication`,
            icon: 'comments',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/communication',
            children: <ScriptInitializedIndicator scriptName='Communication' />
          },
          {
            type: 'nav',
            name: 'User experience',
            href: `/scripts/user-experience`,
            icon: 'mouse-pointer',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/user-experience',
            children: <ScriptInitializedIndicator scriptName='User experience' />
          },
          {
            type: 'nav',
            name: 'Evaluation',
            href: `/scripts/evaluation`,
            icon: 'balance-scale',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/evaluation',
            children: <ScriptInitializedIndicator scriptName='Evaluation' />
          },
          {
            type: 'nav',
            name: 'Brand',
            href: `/scripts/brand`,
            icon: 'tag',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/brand',
            children: <ScriptInitializedIndicator scriptName='Brand' />
          },
          {
            type: 'nav',
            name: 'Evolution',
            href: `/scripts/evolution`,
            icon: 'dna',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/evolution',
            children: <ScriptInitializedIndicator scriptName='Evolution' />
          },
          {
            type: 'nav',
            name: 'Limitations',
            href: `/scripts/limitations`,
            icon: 'traffic-light',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/limitations',
            children: <ScriptInitializedIndicator scriptName='Limitations' />
          },
          {
            type: 'nav',
            name: 'Multimodality',
            href: `/scripts/multimodality`,
            icon: 'circle-nodes',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/multimodality',
            children: <ScriptInitializedIndicator scriptName='Multimodality' />
          },
          {
            type: 'nav',
            name: 'Scaling',
            href: `/scripts/scaling`,
            icon: 'arrow-up-right-dots',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/scaling',
            children: <ScriptInitializedIndicator scriptName='Scaling' />
          },
          {
            type: 'nav',
            name: 'Decision making',
            href: `/scripts/decision-making`,
            icon: 'diagram-project',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/decision-making',
            children: <ScriptInitializedIndicator scriptName='Decision making' />
          },
          {
            type: 'nav',
            name: 'Cognition',
            href: `/scripts/cognition`,
            icon: 'brain',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/cognition',
            children: <ScriptInitializedIndicator scriptName='Cognition' />
          },
          {
            type: 'nav',
            name: 'Creativity',
            href: `/scripts/creativity`,
            icon: 'palette',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/creativity',
            children: <ScriptInitializedIndicator scriptName='Creativity' />
          },
          {
            type: 'nav',
            name: 'Context',
            href: `/scripts/context`,
            icon: 'earth-africa',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/context',
            children: <ScriptInitializedIndicator scriptName='Context' />
          },
          {
            type: 'nav',
            name: 'Memory',
            href: `/scripts/memory`,
            icon: 'database',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/memory',
            children: <ScriptInitializedIndicator scriptName='Memory' />
          },
          {
            type: 'nav',
            name: 'Stategy',
            href: `/scripts/strategy`,
            icon: 'chess-queen',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/strategy',
            children: <ScriptInitializedIndicator scriptName='Strategy' />
          },
          {
            type: 'nav',
            name: 'Perception',
            href: `/scripts/perception`,
            icon: 'eye',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/perception',
            children: <ScriptInitializedIndicator scriptName='Perception' />
          },
          {
            type: 'nav',
            name: 'Ethics',
            href: `/scripts/ethics`,
            icon: 'handshake-simple',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/ethics',
            children: <ScriptInitializedIndicator scriptName='Ethics' />
          },
          {
            type: 'title',
            title: 'Legal',
          },
          {
            type: 'nav',
            name: 'Terms of service',
            href: `/legal/terms-of-service`,
            icon: 'shield-halved',
            iconPrefix: 'fas',
            active: router.asPath === '/legal/terms-of-service'
          },
          {
            type: 'nav',
            name: 'Privacy policy',
            href: `/legal/privacy-policy`,
            icon: 'mask',
            iconPrefix: 'fas',
            active: router.asPath === '/legal/privacy-policy'
          }
        ]}
      >
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
              {
                router.route !== '/' ?
                  <Box width='100%' pt={.75}>
                  <Page>
                  <Button
                    text={show ? 'Hide' : 'Show'}
                    icon={show ? 'eye-slash' : 'eye'}
                    iconPrefix='fas'
                    secondary={true}
                    onClick={() => set_show(!show)}
                  />
                  </Page>
                
                </Box>
                : null
              }
              
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
                  <div>
                    {
                      listening &&  `${(ready ? '"Send" or "Clear"' :'Listening...')}`
                    }
                  </div>
                
                  <Button 
                    icon={listening ? 'microphone-slash' : 'microphone'}
                    iconPrefix='fas'
                    circle={true}
                    onClick={() => {
                      if (listening) {
                        stop()
                      }
                      else {
                        listen()
                        set_ready(false)
                      }
                    }}
                    blink={listening}
                  />
                  <Button 
                    icon='paper-plane'
                    text='Send'
                    onClick={() => makeQuery(query, false)}
                    disabled={loading && queryGuids.length !== 0}
                  />
                </Box>
              
              </S.ButtonContainer>
                <RichTextEditor
                value={query} onChange={(value : string) => set_query(value)} 
                height={'160px'}
                onEnter={(newQuery) => {
                  makeQuery(
                    newQuery.slice(0, -11), // remove unwanted linebreak
                    false
                  )
                }}
              />
            </S.Footer>
          </S.AltPage>
        </Box>
      </S.Container>
      </Navigation>
      <Modal 
        title='Insert content'
        icon='plus'
        iconPrefix='fas'
        size='xl'
        isOpen={open}
        onClose={() => set_open(false)}
        content={<S.FlexStart wrap={true}>
          <Gap gap={1}>
            <Gap>
              <TextInput 
                value={contentUrl}
                label='Webpage URL'
                icon='globe'
                iconPrefix='fas'
                onChange={newValue => set_contentUrl(newValue)}
              />
              <Button
                text='Insert webpage content'
                icon='plus'
                iconPrefix='fas'
                  hero={true}
                  expand={true}
                onClick={() => {
                  getArticleTranscript()
                }}
              />
            </Gap>
            <LineBreak />
            <Gap>
              <TextInput 
                value={videoUrl}
                label='YouTube Video URL'
                onChange={newValue => set_videoURL(newValue)}
                icon='youtube'
                iconPrefix='fab'

              />
              <Button
                text='Insert video transcript'
                icon='plus'
                iconPrefix='fas'
                hero={true}
                expand={true}
                onClick={() => {
                  getYouTubeTranscript()
                }}
              />
            </Gap>
            <S.Iframe src='https://www.google.com/search?igu=1 ' width='100%' height='500px'></S.Iframe>
          </Gap>
        </S.FlexStart>}
      />
    </div>
  )
}

export default Home

const S = {
  Iframe: styled.iframe`
    width: 100%;
    height: 500px;
    border-radius: 1rem;
    overflow: hidden;
    padding-bottom: 2rem;
  `,
  Container: styled.div`
    height: calc(100vh - var(--F_Header_Height));
    width: 100%;
    overflow: hidden;
    background: var(--F_Background);
  `,
  Content: styled.div`
    width: 100%;
    height: calc(calc(100vh - calc(var(--F_Header_Height) + var(--L_Prompt_Height))) - calc(var(--L_Prompt_Padding) * 2)); 
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    background: var(--F_Background);
  `,
  AltPage: styled.div`
    width: 700px;
    max-width: calc(100vw - 1.5rem);

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