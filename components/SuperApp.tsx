import { NavSpaces, NavTabs, Item, Placeholders, Box, DateAndTimePicker, stringInArray, useBreakpoint, Gap, Button, Page, TextInput, Dropdown } from '@avsync.live/formation'
import router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import Chat from './Chat'
interface Props {
  
}

const SuperApp = ({ }: Props) => {
  const [ activeSwipeIndex, setActiveSwipeIndex ] = useState(0)
  const activeGuid = 'test'
  const { isMobile, isTablet } = useBreakpoint()

  const [activeSpaceIndex, set_activeSpaceIndex] = useState(2)

  const incrementSwipeIndex = () => {
    if (isMobile) {
      setActiveSwipeIndex(1)
    }
    if (isTablet) {
      setActiveSwipeIndex(0)
    }
  }


  const renderFirstPage = () => {
    switch(router.route) {
      case '/':
        return <S.Sidebar>
        <Box height='var(--F_Header_Height)' width='100%'/>
        {
          [
            {
              type: 'nav',
              name: 'How to create AGI',
              icon: 'message',
              iconPrefix: 'far',
              onClick: () => {
                setActiveSwipeIndex(1)
              },
              active: router.asPath === '/',
              children: <>
               <Dropdown
                  options={[
                    {
                      "icon": "ellipsis-v",
                      "iconPrefix": "fas",
                      "dropDownOptions": [
                        {
                          "icon": "edit",
                          iconPrefix: 'fas',
                          "text": "Rename"
                        },
                        {
                          "icon": "trash-alt",
                          iconPrefix: 'fas',
                          "text": "Delete"
                        },

                      ]
                    }
                  ]}
                />
              </>
            },
            {
              type: 'nav',
              name: 'Writing good Typescript',
              icon: 'message',
              iconPrefix: 'far',
              onClick: () => {
                setActiveSwipeIndex(2)
              },
              active: router.asPath === '/search',
              children: <>
               <Dropdown
                  options={[
                    {
                      "icon": "ellipsis-v",
                      "iconPrefix": "fas",
                      "dropDownOptions": [
                        {
                          "icon": "edit",
                          iconPrefix: 'fas',
                          "text": "Rename"
                        },
                        {
                          "icon": "trash-alt",
                          iconPrefix: 'fas',
                          "text": "Delete"
                        },

                      ]
                    }
                  ]}
                />
              </>
            },
            {
              type: 'nav',
              name: 'Converting Typescript to Python',
              icon: 'message',
              iconPrefix: 'far',
              href: '/projects',
              active: router.asPath === '/projects',
              children: <>
               <Dropdown
                  options={[
                    {
                      "icon": "ellipsis-v",
                      "iconPrefix": "fas",
                      "dropDownOptions": [
                        {
                          "icon": "edit",
                          iconPrefix: 'fas',
                          "text": "Rename"
                        },
                        {
                          "icon": "trash-alt",
                          iconPrefix: 'fas',
                          "text": "Delete"
                        },

                      ]
                    }
                  ]}
                />
              </>
            },
            {
              type: 'nav',
              icon: 'plus',
              iconPrefix: 'fas',
              name: 'New chat',
              href: '/tasks',
              active: router.asPath === '/tasks'
            },
          ].map(item => <Item {...item}/>)
        }
      </S.Sidebar>

      case '/search':
        return <S.Sidebar>
        <Box height='var(--F_Header_Height)' width='100%'/>
        {
          [
            {
              type: 'nav',
              name: 'search term 1',
              icon: 'search',
              iconPrefix: 'fas',
              onClick: () => {
                setActiveSwipeIndex(1)
              },
              active: router.asPath === '/'
            },
            {
              type: 'nav',
              name: 'search term 2',
              icon: 'search',
              iconPrefix: 'fas',
              onClick: () => {
                setActiveSwipeIndex(2)
              },
              active: router.asPath === '/search'
            },
            {
              type: 'nav',
              name: 'search term 3',
              icon: 'search',
              iconPrefix: 'fas',
              href: '/projects',
              active: router.asPath === '/projects'
            },
            {
              type: 'nav',
              name: 'search term 4',
              href: '/tasks',
              active: router.asPath === '/tasks',
              icon: 'search',
              iconPrefix: 'fas',
            },
            {
              type: 'nav',
              icon: 'plus',
              iconPrefix: 'fas',
              name: 'New search',
              href: '/tasks',
              active: router.asPath === '/tasks'
            },
          ].map(item => <Item {...item}/>)
        }
      </S.Sidebar>

  case '/projects':
    return <S.Sidebar>
    <Box height='var(--F_Header_Height)' width='100%'/>
    {
      [
        {
          type: 'nav',
          name: 'AVsync.LIVE',
          onClick: () => {
            setActiveSwipeIndex(1)
          },
          active: router.asPath === '/'
        },
        {
          type: 'nav',
          name: 'Lexi.studio',
          onClick: () => {
            setActiveSwipeIndex(2)
          },
          active: router.asPath === '/search'
        },
        {
          type: 'nav',
          name: 'UAGC Installation',
          href: '/projects',
          active: router.asPath === '/projects'
        },
        {
          type: 'nav',
          icon: 'plus',
          iconPrefix: 'fas',
          name: 'New project',
          href: '/tasks',
          active: router.asPath === '/tasks'
        },
      ].map(item => <Item {...item}/>)
  }
</S.Sidebar>

case '/tools':
  return <S.Sidebar>
  <Box height='var(--F_Header_Height)' width='100%'/>
  {
    [
      {
        type: 'nav',
        name: 'Text-to-speech',
        onClick: () => {
          setActiveSwipeIndex(1)
        },
        active: router.asPath === '/'
      },
      {
        type: 'nav',
        name: 'Speech-to-text',
        onClick: () => {
          setActiveSwipeIndex(2)
        },
        active: router.asPath === '/search'
      },
      {
        type: 'nav',
        name: 'Content writer',
        onClick: () => {
          setActiveSwipeIndex(2)
        },
        active: router.asPath === '/search'
      },
      {
        type: 'nav',
        icon: 'plus',
        iconPrefix: 'fas',
        name: 'New search',
        href: '/tasks',
        active: router.asPath === '/tasks'
      },
    ].map(item => <Item {...item}/>)
  }
</S.Sidebar>
    }
  }

  const renderSecondPage = () => {
    return <>
      {
        !isMobile && <S.HeaderSpacer />
      }
      <Chat></Chat>
    </>
  }

  const renderThirdPage = () => {
    return <S.ThirdPage>
       
          <S.Iframe 
          src={search ? `https://search.lexi.studio/search?q=${search}` : ''} 
          width='100%'></S.Iframe>
           <Gap gap={.75}>
            <Box width='100%' p={.5}>
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
                // insertContentByUrl()
              }
            }
            />
            
          </Box>
         
          </Gap>
    </S.ThirdPage>
  }

  const router = useRouter()

  const [search, set_search] = useState('')
  const [url, set_url] = useState('')

  const submitSearch = () => {
    // set_open(true)
    setActiveSwipeIndex(2)
  }

  return (<S.SuperApp>
    <S.NavHeader>
      <Gap disableWrap>
        <div onClick={() => setActiveSwipeIndex(activeSwipeIndex > 1 ? activeSwipeIndex - 1 : 0)}>
        <S.Logo src='/assets/lexi-circle.png'/>
          
        </div>
          <Page >
            {/* <Box>
              <TextInput
                compact
                icon='search'
                iconPrefix='fas'
                value={search}
                onChange={newValue => set_search(newValue)}
                onEnter={submitSearch}
              />
              <Button 
                icon='times'
                circle
                iconPrefix='fas'
                disabled={search === ''}
                onClick={() => set_search('')}
                minimal
              />
              <Button 
                icon='arrow-right'
                circle
                iconPrefix='fas'
                disabled={search === ''}
                secondary={search === ''}
                onClick={submitSearch}
                minimal
              />
            </Box> */}
            
          </Page>
          {/* <Spacer />
          <Gap autoWidth disableWrap>
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
          </Gap> */}
         
        </Gap>
    </S.NavHeader>
  <NavSpaces
    activeSwipeIndex={activeSwipeIndex}
    onSwipe={index => setActiveSwipeIndex(index)}
    spaces={[]}
    activeSpaceIndex={activeSpaceIndex}
    onSetActiveSpacesIndex={index => set_activeSpaceIndex(index)}
    channels={[]}
    firstPage={renderFirstPage()}
    secondPage={renderSecondPage()}
    thirdPage={renderThirdPage()}
    dropdownOptions={[
    {
        icon: 'ellipsis-v',
        iconPrefix: 'fas',
        dropDownOptions: [
        {
            icon: 'user-plus',
            iconPrefix: 'fas',
            text: 'Invite'
        },
        {
            icon: 'share',
            iconPrefix: 'fas',
            text: 'Share'
        },
        {
            icon: 'archive',
            iconPrefix: 'fas',
            text: 'Archive',
        },
        {
            icon: 'trash-alt',
            text: 'Trash',
            onClick: () => {
            // ecEvent_Delete({
            //   eventGuid: activeGuid
            // })
            }
        },
        ] 
    }
    ]}
    navsPrimary={[
    {
        icon: 'message',
        iconPrefix: router.route.includes(`/`) ? 'fas' : 'fas',
        title: 'Chat',
        href: `/`,
        active: router.route === `/`
    },
    {
        icon: 'search',
        iconPrefix: router.route.includes(`/search`) ? 'fas' : 'fas',
        title: 'Search',
        href: `/search`,
        active: router.route === `/search`
    },
    {
        icon: 'bookmark',
        iconPrefix: router.route === `/projects` ? 'fas' : 'fas',
        title: 'Projects',
        href: '/projects',
        active: router.route === `/projects`
    },
    {
        icon: 'wrench',
        iconPrefix: router.route === `/tools` ? 'fas' : 'fas',
        title: 'Tools',
        href: '/tools',
        active: router.route === `/tools`
    }
    ]}
    navsSecondary={[
    {
        title: 'Discuss',
        icon: 'message',
        iconPrefix: 'fas',
        href: `/spaces/${activeGuid}`,
        active: stringInArray(router.route, [`/spaces/[guid]`]),
        hideOptions: true,
        onClick: incrementSwipeIndex
    },
    {
        title: 'Notes',
        icon: 'list',
        iconPrefix: 'fas',
        href: `/spaces/${activeGuid}/teams`,
        active: stringInArray(router.route, [`/spaces/[guid]/notes`]),
        hideOptions: true,
        onClick: incrementSwipeIndex
    },
    {
        title: 'Files',
        icon: 'folder',
        iconPrefix: 'fas',
        href: `/spaces/${activeGuid}/files`,
        hideOptions: true,
        active: stringInArray(router.route, [
        `/spaces/[guid]/files`,
        ]),
        onClick: incrementSwipeIndex
    },
    {
        title: 'Tasks',
        icon: 'check-square',
        iconPrefix: 'fas',
        href: `/spaces/${activeGuid}/tasks`,
        hideOptions: true,
        active: router.route.includes(`/spaces/[guid]/tasks`),
        onClick: incrementSwipeIndex
    },
    
    ]}
  />
  </S.SuperApp>)
}

export default SuperApp

const S = {
  Iframe: styled.iframe`
    width: 100%;
    height: calc(calc(100% - var(--F_Input_Height)) - 1rem);
    overflow: hidden;
  `,
  SuperApp: styled.div`
    width: 100%;
  `,
  NavHeader: styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--F_Header_Height);
    z-index: 9;
    background: var(--F_Background);
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--F_Surface);
  `,
  HeaderSpacer: styled.div`
    width: 100%;
    height: var(--F_Header_Height);
  `,
  Logo: styled.img`
    height: var(--F_Input_Height);
    width: var(--F_Input_Height);
    position: relative;
    left: .75rem;
  `,
  Sidebar: styled.div`
    border-right: 1px solid var(--F_Surface);
    width: calc(100% - 1px);
    height: 100%;
    overflow-y: auto;
  `,
  ThirdPage: styled.div`
    height: 100%;
    width: 100%;
  `
}