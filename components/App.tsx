import { NavSpaces, NavTabs, Item, Placeholders, Box, DateAndTimePicker, stringInArray, useBreakpoint, Gap, Button, Page, TextInput, Dropdown } from '@avsync.live/formation'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useLayout } from 'redux-tk/layout/hook'
import styled from 'styled-components'

import Chat from './Chat'
import { Search } from './Search'
import { SearchResults } from './SearchResults'
interface Props {
  
}

const App = React.memo(({ }: Props) => {
  const { isMobile, isDesktop } = useBreakpoint()

  const {activeSwipeIndex, setActiveSwipeIndex } = useLayout()
  const [activeSpaceIndex, set_activeSpaceIndex] = useState(0)

  const renderFirstPage = () => {
    switch(router.route) {
      case '/':
        return <S.Sidebar>
          <Box height='var(--F_Header_Height)' width='100%'/>
          <Box p={.75} width='calc(100% - 1.5rem)'>
            <Button
              text='New chat'
              icon='plus'
              iconPrefix='fas'
              secondary
              expand
            />
          </Box>
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
            },
            {
              type: 'nav',
              name: 'Converting Typescript to Python',
              icon: 'message',
              iconPrefix: 'far',
              href: '/projects',
              active: router.asPath === '/projects',
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
              icon: 'clock',
              iconPrefix: 'fas',
              onClick: () => {
                setActiveSwipeIndex(1)
              },
              active: router.asPath === '/'
            },
            {
              type: 'nav',
              name: 'search term 2',
              icon: 'clock',
              iconPrefix: 'fas',
              onClick: () => {
                setActiveSwipeIndex(2)
              },
              active: router.asPath === '/search'
            },
            {
              type: 'nav',
              name: 'search term 3',
              icon: 'clock',
              iconPrefix: 'fas',
              href: '/projects',
              active: router.asPath === '/projects'
            },
            {
              type: 'nav',
              name: 'search term 4',
              href: '/tasks',
              active: router.asPath === '/tasks',
              icon: 'clock',
              iconPrefix: 'fas'
            },
           
          ].map(item => <Item {...item}/>)
        }
      </S.Sidebar>

  case '/projects':
    return <S.Sidebar>
    <Box height='var(--F_Header_Height)' width='100%'/>
    <Box p={.75} width='calc(100% - 1.5rem)'>
      <Button
        text='New project'
        icon='plus'
        iconPrefix='fas'
        secondary
        expand
      />
    </Box>
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
      <Chat />
    </>
  }

  const renderThirdPage = () => {
    return <S.ThirdPage>
      <SearchResults />
    </S.ThirdPage>
  }

  const router = useRouter()

  

  return (<S.App>
    <S.NavHeader>
      <S.Logo 
        src='/assets/lexi-circle.png'
        onClick={() => setActiveSwipeIndex(activeSwipeIndex > 1 ? activeSwipeIndex - 1 : 0)}
      />
      <S.Centered isDesktop={isDesktop}>
      <Search />

      </S.Centered>
    </S.NavHeader>
    <NavSpaces
      dropdownOptions={[]}
      disableTablet
      activeSwipeIndex={activeSwipeIndex}
      onSwipe={index => setActiveSwipeIndex(index)}
      spaces={[]}
      activeSpaceIndex={activeSpaceIndex}
      onSetActiveSpacesIndex={index => set_activeSpaceIndex(index)}
      channels={[]}
      firstPage={renderFirstPage()}
      secondPage={renderSecondPage()}
      thirdPage={renderThirdPage()}
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
        icon: 'user',
        iconPrefix: router.route.includes(`/login`) ? 'fas' : 'fas',
        title: 'Profile',
        href: `/login`,
        active: router.route === `/login`
      },
      ]}
    />
  </S.App>)
})

export default App

const S = {
  Iframe: styled.iframe`
    width: 100%;
    height: 100%;
    overflow: hidden;
  `,
  App: styled.div`
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
    gap: .75rem;
    align-items: center;
    border-bottom: 1px solid var(--F_Surface);
  `,
  Centered: styled.div<{
    isDesktop: boolean
  }>`
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    width: calc(100% - 94px);
    width: ${props => props.isDesktop ? '100%' : 'calc(100% - 45px)'};

    margin-left: ${props => props.isDesktop ? '-141px' : '22px'};
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