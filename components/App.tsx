import { NavSpaces, Box, useBreakpoint } from '@avsync.live/formation'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLayout_activeSwipeIndex, useLayout_setActiveSwipeIndex } from 'redux-tk/layout/hook'
import styled from 'styled-components'

import { SpaceSidebar } from './SpaceSidebar'
import { SearchBar } from './SearchBar'
import { Search } from './Search/Search'
import { AddSpace } from './AddSpace'
import { EditSpace } from './EditSpace'
import { EditGroup } from './EditGroup'
import { useSpaces_spaceGuids, useSpaces_setActiveSpaceGuid, useSpaces_setActiveGroupGuid } from 'redux-tk/spaces/hook'
import { useDispatch } from 'react-redux'
import { fetchInitialData } from 'redux-tk/spaces/slice'
import type { Dispatch } from '@reduxjs/toolkit'
import { EditChannel } from './EditChannel'
import { Channel } from './Channel'
import { Logo } from './Logo'
import Link from './Link'
import { Space } from './Space'
import Chatbot from './Chatbot'
import { ActiveSpaceMap } from './ActiveSpaceMap'

interface Props {
  children: React.ReactNode
}

const App = ({ children }: Props) => {
  const router = useRouter()

  const dispatch: Dispatch = useDispatch();
  const spaceGuids = useSpaces_spaceGuids()

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchInitialData());
  }, [dispatch]);

  useEffect(() => {
    if (spaceGuids.length && (router.route === '/' || router.route === '/spaces') ) {
      router.push(`/spaces/${spaceGuids[0]}`)
    }
  }, [spaceGuids, router.route])

  const { isMobile, isTablet, isDesktop } = useBreakpoint()

  const activeSwipeIndex = useLayout_activeSwipeIndex()
  const setActiveSwipeIndex = useLayout_setActiveSwipeIndex()

  const [activeSpaceIndex, set_activeSpaceIndex] = useState(0)
  
  const setActiveSpaceGuid = useSpaces_setActiveSpaceGuid()
  const setActiveGroupGuid = useSpaces_setActiveGroupGuid()

  const renderInnerSidebar = () => {
    switch(router.route) {
      case '/spaces/add':
        return <AddSpace />
      case '/spaces/[spaceGuid]/edit':
        return <EditSpace />
      case '/spaces/[spaceGuid]/groups/[groupGuid]/edit':
        return <EditGroup />
      case '/spaces/[spaceGuid]/groups/[groupGuid]/channels/[channelGuid]/edit':
        return <EditChannel />
      default:
        return <SpaceSidebar />
    }
  }

  const renderFirstPage = () => {
    return <S.Sidebar>
      { 
        renderInnerSidebar() 
      }
    </S.Sidebar>
  }

  const renderSecondPage = () => {
    
    switch(router.route) {
      case('/spaces/[spaceGuid]/groups/[groupGuid]/channels/[channelGuid]'):
        return <>
          <Channel />
        </>
      case '/spaces/[spaceGuid]':
        return <>
          <Space />
        </>
    }
  }

  const renderThirdPage = () => {
    return <S.ThirdPage>
      {/* <Chatbot /> */}
      <Search />
      <ActiveSpaceMap />
    </S.ThirdPage>
  }

  const { spaceGuid, groupGuid } = router.query

  useEffect(() => {
    setActiveSpaceGuid(spaceGuid as string)
  }, [spaceGuid])

  useEffect(() => {
    if (groupGuid) {
      setActiveGroupGuid(groupGuid as string)
    }
  }, [groupGuid])

  return (<S.App>
    {/* <S.NavHeader>
      <Link href='/'>
        <Box width='78px'>
          <Logo />
        </Box>
      </Link>

      <S.Centered isDesktop={isDesktop}>
        <SearchBar />
      </S.Centered>
    </S.NavHeader> */}
    <NavSpaces
      dropdownOptions={[]}
      disableTablet
      activeSwipeIndex={activeSwipeIndex}
      onSwipe={index => setActiveSwipeIndex(index)}
      spaces={[]}
      activeSpaceIndex={activeSpaceIndex}
      onSetActiveSpacesIndex={index => set_activeSpaceIndex(index)}
      channels={[]}
      sidebarWidth='380px'
      firstPage={renderFirstPage()}
      secondPage={renderSecondPage()}
      thirdPage={renderThirdPage()}
      navsPrimary={[
      {
        icon: 'diagram-project',
        iconPrefix: router.route.includes(`/spaces`) || router.route === '/' ? 'fas' : 'fas',
        title: 'Spaces',
        href: `/spaces`,
        active: router.route.includes(`/spaces`) || router.route === '/'
      },
      {
        icon: 'users',
        iconPrefix: router.route.includes(`/personas`) ? 'fas' : 'fas',
        title: 'Personas',
        href: `/personas`,
        active: router.route === `/personas`
      },
      {
        icon: 'user-circle',
        iconPrefix: router.route.includes(`/login`) ? 'fas' : 'fas',
        title: 'Profile',
        href: `/login`,
        active: router.route === `/login`
      },
      ]}
    />
  </S.App>)
}

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
    align-items: center;
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
    width: ${props => props.isDesktop ? '100%' : 'calc(100% - 80px)'};

    margin-left: ${props => props.isDesktop ? '-141px' : '22px'};
  `,
  HeaderSpacer: styled.div`
    width: 100%;
    height: var(--F_Header_Height);
  `,
  LogoContainer: styled.div`
    width: 38px;
    min-width: 38px;
    margin-left: 19px;
    max-width: 38px;
    height: var(--F_Header_Height);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 38px;
    position: relative;;
    * {
      border-radius: 100%;
    }
  `,
  Logo: styled.img`
    height: var(--F_Input_Height);
    width: var(--F_Input_Height);
  `,
  Connection: styled.div`
    position: absolute;
    z-index:1;
    transform: scale(.5);
    transform-origin: center;
    opacity: .4;
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