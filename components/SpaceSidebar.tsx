import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'

import { Groups } from 'components/Groups'
import { AspectRatio, Box, SpacesSidebar, Item, Dropdown, Gap, Button, LineBreak, Label, Spacer } from '@avsync.live/formation'
import { useSpaces_activeSpace, useSpaces_activeSpaceGuid, useSpaces_removeSpace, useSpaces_spaceGuids, useSpaces_spacesInfo, useSpaces_updateSpace, useSpaces_activeSpaceStats } from 'redux-tk/spaces/hook'
import { useRouter } from 'next/router'
import { Badge } from './Badge'
import { SpaceCard } from './SpaceCard'

interface Props {

}

export const SpaceSidebar = React.memo(({ }: Props) => {
  const router = useRouter()

  const { spaceGuid } = router.query

  const spacesInfo = useSpaces_spacesInfo()
  const spaceGuids = useSpaces_spaceGuids()
  const activeSpace = useSpaces_activeSpace()
  const removeSpace = useSpaces_removeSpace()
  const activeSpaceGuid = useSpaces_activeSpaceGuid()
  const updateSpace = useSpaces_updateSpace()
  const activeSpaceStats = useSpaces_activeSpaceStats()


  const [activeSpaceIndex, set_activeSpaceIndex] = useState(spaceGuids.indexOf(spaceGuid as string))

  useEffect(() => {
    set_activeSpaceIndex(spaceGuids.indexOf(spaceGuid as string))
  }, [spaceGuid])

  return (<S.GroupsSidebar>
    <SpacesSidebar 
      activeSpaceIndex={activeSpaceIndex}
      onClickIndex={(index : number) => set_activeSpaceIndex(index)}
      spaces={[
        ...spacesInfo.map(space => (
          {
            name: space.name,
            href: `/spaces/${space.guid}`,
            src: space.previewSrc
          }
        )),
        {
          icon: 'plus',
          iconPrefix: 'fas',
          href: '/spaces/add'
        }
      ]}
    />
    <S.SidebarContainer>
      <Box wrap width='100%'>
        <Box p={.75} width='100%'>
          <SpaceCard 
            name={activeSpace?.name}
            previewSrc={activeSpace?.previewSrc}
            {
              ...activeSpaceStats
            }
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
                href: `/spaces/${activeSpaceGuid}/edit`
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
                  if (activeSpaceGuid) {
                    removeSpace(activeSpaceGuid)
                    router.push('/spaces')
                  }

                }
              }
            ]}
          />
          </SpaceCard>
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