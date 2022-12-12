import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import cuid from 'cuid'
import axios from 'axios'

import {
  Button,
  Navigation,
  RichTextEditor,
  Gap,
  Page,
  StyleHTML,
  ParseHTML,
  Box,
  LineBreak,
  Avatar,
  Spacer,
  LoadingSpinner,
  useScrollTo,
} from '@avsync.live/formation'
import styled from 'styled-components'
import { useRouter } from 'next/router'

const Home: NextPage = () => {

  const [queriesByGuid, set_queriesByGuid] = useState<{
    [guid: string]: {
      query: string,
      response?: string,
      loading: boolean,
      error?: string
    }
  }>({})
  const [queryGuids, set_queryGuids] = useState<string[]>([])

  const [query, set_query] = useState('')

  const makeQuery = (query: string, initialize: boolean) => {
    const guid = cuid()
    set_queryGuids([...queryGuids, guid])
    set_queriesByGuid({
      ...queriesByGuid,
      [guid]: {
        query,
        loading: true, 
      }
    });

    (async () => {
      try {
        const loginRes = await axios({
          method: 'POST',
          url: initialize ? '/lexi/chat/init' : `/lexi/chat`,
          data: {
            query
          }
        })
        const { status, msg, data } = loginRes.data

        if (status === 'success') {
          set_queriesByGuid({
            ...queriesByGuid,
            [guid]: {
              query,
              loading: false,
              response: data.response
            }
          });
          return;
        }
        else {
          console.log('Error')
          alert('Something went wrong')
        }
      }
      catch(e) {
        console.log('Error')
        alert('Something went wrong')
      }
    })()

    set_query('')
    set_scrollTo(true);
  }

  const queries = Object.keys(queriesByGuid).map(guid => queriesByGuid[guid]) 

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const scrollToRef = useRef<HTMLDivElement | null>(null)

  const { set_scrollTo } = useScrollTo(scrollContainerRef, scrollToRef);

  useEffect(() => {
    set_scrollTo(false)
  }, [queries.length])

  useEffect(() => {
    if (queries.length === 0) {
      makeQuery('Hello, Lexi.', true)
    }
  }, [])

  const Response = ({ query, speaker }: { query: string, speaker?: string}) => {
    const isLexi = speaker === 'Lexi'
    return (<S.Response isLexi={isLexi}>
      <Box width='100%' wrap={true}>
        <LineBreak light={true} />
  
        <Box width='100%' py={.75}>
          <Page>

          <S.FlexStart>
            <Box pt={1}>
              <Avatar 
                src={isLexi ? '/assets/lexi-favicon.svg' : undefined}
                icon={isLexi ? undefined : 'user'}
                iconPrefix='fas'
                color={isLexi ? 'var(--F_Primary)' : 'var(--F_Surface_0)'}
              />
            </Box>
  
            {
              query
                ? <Spacer>
                    <StyleHTML>
                      <ParseHTML markdown={query}/>
                    </StyleHTML>
                  </Spacer>
                : <LoadingSpinner />
            }
          </S.FlexStart>
          </Page>
        </Box>
      </Box>
    </S.Response>)
  }

  const router = useRouter()

  return (
    <div>
      <Navigation
        navLogoSrc={'/assets/lexi-typography.svg'}
        navs={[
          {
            type: 'nav',
            name: 'Lexichat',
            icon: 'message',
            href: '/'
          },
          {
            type: 'nav',
            name: 'Conversations',
            icon: 'book',
            href: '/'
          },
          {
            type: 'spacer'
          },
          {
            type: 'nav',
            name: 'About',
            icon: 'info',
            href: '/'
          },
          {
            type: 'nav',
            name: 'FAQ',
            icon: 'question',
            href: '/'
          },
          {
            type: 'nav',
            name: 'Resources',
            icon: 'lightbulb',
            href: '/'
          }
        ]}
      >
        <S.Container>
          <S.Content ref={scrollContainerRef}>
            <Gap>

            {
              queries.map(({query, response}, index) => <>
                <Box width='100%' wrap={true}>
                  <Response query={query} speaker='User' />
                  </Box>
                  <Box width='100%' wrap={true} >
                    <Response query={response ? response : ''} speaker='Lexi' />
                    
                  </Box>
                </>
              )
            }
            <div ref={scrollToRef}></div>

            <Box width={'100%'}></Box>
              </Gap>

          </S.Content>
          <Page>
          <S.Footer>
            

            <RichTextEditor
              value={query} onChange={(value : string) => set_query(value)} 
            />
            
            <S.ButtonContainer>

              <Button 
                  text='Send'
                  icon='paper-plane'
                  expand={true}
                  onClick={() => makeQuery(query, false)}
                />
            </S.ButtonContainer>
          </S.Footer>
          </Page>

        </S.Container>

      </Navigation>
    </div>
  )
}

export default Home

const S = {
  Container: styled.div`
    height: calc(100vh - var(--F_Header_Height));
    width: 100%;
    overflow: hidden;
  `,
  Content: styled.div`
    width: 100%;
    height: calc(100vh - calc(var(--F_Header_Height) + 300px)); 
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    overflow-y: auto;
    overflow-x: hidden;
  `,
  Footer: styled.div`
    position:relative;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 254px;
    overflow-y: auto;
  `,
  ButtonContainer: styled.div`
    position: absolute;
    right: 4px;
    top: 4px;
  `,
  Response: styled.div<{
    isLexi?: boolean
  }>`
    width: 100%;
    background: ${props => props.isLexi ? 'var(--F_Background_Alternating)': 'none'};
  `,
  FlexStart: styled.div`
    width: 100%;
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
  `

}