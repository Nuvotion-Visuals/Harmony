import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'

import { Groups } from 'components/Groups'
import { AspectRatio, Box, SpacesSidebar, Item, Dropdown, Gap, Button, LineBreak, Label, Spacer } from '@avsync.live/formation'
import { useSpaces } from 'redux-tk/spaces/hook'
import { useRouter } from 'next/router'
import { Badge } from './Badge'
import { SpaceCard } from './SpaceCard'

interface Props {

}

export const SpaceSidebar = React.memo(({ }: Props) => {
  const router = useRouter()

  const { spaceGuid } = router.query

  const { spacesInfo, spaceGuids, activeSpace, removeSpace, activeSpaceGuid, updateSpace, activeSpaceStats } = useSpaces()

  const [activeSpaceIndex, set_activeSpaceIndex] = useState(spaceGuids.indexOf(spaceGuid as string))

  const locked = activeSpace?.locked

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
                text: locked ? 'Unlock' : 'Lock',
                icon: locked ? 'lock' : 'lock-open',
                iconPrefix: 'fas',
                onClick: () => {
                  updateSpace({
                    guid: spaceGuid as string,
                    space: {
                      ...activeSpace!,
                      locked: !locked
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
        <Groups locked={locked!} />
      </Box>
    </S.SidebarContainer>
  </S.GroupsSidebar>)
})

const S = {
  GroupsSidebar: styled.div`
    display: flex;
    height: calc(100% - var(--F_Header_Height));
    align-items: flex-start;
  `,
  SidebarContainer: styled.div`
    height: calc(100vh - calc(2 * var(--F_Header_Height)));
    width: 100%;
    overflow-y: auto;
  `
}