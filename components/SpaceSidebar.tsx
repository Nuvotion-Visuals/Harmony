import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'

import { Groups } from 'components/Groups'
import { AspectRatio, Box, SpacesSidebar, Item, Dropdown, Gap, Button, LineBreak, Label, Spacer, ItemProps } from '@avsync.live/formation'
import { useSpaces_activeSpace, useSpaces_activeSpaceGuid, useSpaces_removeSpace, useSpaces_spaceGuids, useSpaces_spacesInfo, useSpaces_updateSpace, useSpaces_activeSpaceStats, useSpaces_setActiveSpaceIndex, useSpaces_activeSpaceIndex } from 'redux-tk/spaces/hook'
import { useRouter } from 'next/router'
import { Badge } from './Badge'
import { SpaceCard } from './SpaceCard'
import { Logo } from './Logo'
import MyLink from './Link'
import { Space } from 'redux-tk/spaces/types'

export const SpaceCardComponent = React.memo(() => {
  const router = useRouter()
  const { spaceGuid } = router.query

  const activeSpace = useSpaces_activeSpace()
  const removeSpace = useSpaces_removeSpace()
  const updateSpace = useSpaces_updateSpace()
  const activeSpaceStats = useSpaces_activeSpaceStats()

  return (
    <Box p={.75} width='100%'>
      <SpaceCard
        name={activeSpace?.name}
        previewSrc={activeSpace?.previewSrc}
        {...activeSpaceStats}
      >
        <Dropdown
          icon='ellipsis-h'
          iconPrefix='fas'
          circle
          items={[
            {
              text: 'Edit',
              icon: 'edit',
              iconPrefix: 'fas',
              href: `/spaces/${activeSpace?.guid}/edit`
            },
            {
              text: activeSpace?.locked ? 'Unlock' : 'Lock',
              icon: activeSpace?.locked ? 'lock' : 'lock-open',
              iconPrefix: 'fas',
              onClick: () => {
                updateSpace({
                  guid: spaceGuid as string,
                  space: {
                    ...activeSpace!,
                    locked: !activeSpace?.locked
                  }
                })
              }
            },
            {
              text: 'Remove',
              icon: 'trash-alt',
              iconPrefix: 'fas',
              onClick: () => {
                if (activeSpace?.guid) {
                  removeSpace(activeSpace?.guid)
                  router.push('/spaces')
                }
              }
            }
          ]}
        />
      </SpaceCard>
    </Box>
  )
})

const arePropsEqual = (prevProps: any, nextProps: any) => {
  // Explicitly compare individual props that should trigger a rerender if changed
  if (prevProps.activeSpaceIndex !== nextProps.activeSpaceIndex) return false

  if (prevProps.spaces.length !== nextProps.spaces.length) return false

  for (let i = 0; i < prevProps.spaces.length; i++) {
    if (prevProps.spaces[i].name !== nextProps.spaces[i].name ||
        prevProps.spaces[i].href !== nextProps.spaces[i].href ||
        prevProps.spaces[i].src !== nextProps.spaces[i].src) {
      return false
    }
  }

  // If none of the conditions are met, then the props are equal.
  return true
}
const MemoizedSpacesSidebar = React.memo(SpacesSidebar, arePropsEqual)

const SpacesSidebarComponent = () => {
  const spacesInfo = useSpaces_spacesInfo()
  const activeSpaceIndex = useSpaces_activeSpaceIndex()
  const setActiveSpaceIndex = useSpaces_setActiveSpaceIndex()

  const onClickIndex = useCallback((index: number) => {
    setActiveSpaceIndex(index)
  }, [setActiveSpaceIndex])

  const spaces = [
    ...spacesInfo.map(space => ({
      name: space.name,
      href: `/spaces/${space.guid}`,
      src: space.previewSrc
    })),
    {
      icon: 'plus',
      iconPrefix: 'fas',
      href: '/spaces/add'
    }
  ] as ItemProps[]

  return (
    <MemoizedSpacesSidebar
      activeSpaceIndex={activeSpaceIndex}
      onClickIndex={onClickIndex}
      spaces={spaces}
    >
      <MyLink href='/'>
        <Logo />
      </MyLink>
    </MemoizedSpacesSidebar>
  )
}

interface Props {

}

export const SpaceSidebar = React.memo(({ }: Props) => {
  return (<S.GroupsSidebar>
    <SpacesSidebarComponent />
    <S.SidebarContainer>
      <Box wrap width='100%'>
        <Box p={.75} width='100%'>
          <SpaceCardComponent />
        </Box>
        <Groups />
      </Box>
    </S.SidebarContainer>
  </S.GroupsSidebar>)
})

const S = {
  GroupsSidebar: styled.div`
    display: flex;
    height: 100%;
    align-items: flex-start;
  `,
  SidebarContainer: styled.div`
    height: calc(calc(100vh - calc(1 * var(--F_Header_Height))) - .25rem);
    width: 100%;
    overflow-y: auto;
  `
}