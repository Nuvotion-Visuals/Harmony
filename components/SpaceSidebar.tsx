import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Groups } from 'components/Groups'
import { AspectRatio, Box, SpacesSidebar, Item, Dropdown, Gap, Button, LineBreak, Label, Spacer } from '@avsync.live/formation'
import { useSpaces } from 'redux-tk/spaces/hook'
import { useRouter } from 'next/router'

interface Props {

}

export const SpaceSidebar = ({ }: Props) => {
  const router = useRouter()

  const { spaceGuid } = router.query

  const { spacesInfo, spaceGuids, activeSpace, removeSpace, activeSpaceGuid, updateSpace, activeSpaceStats } = useSpaces()

  const [activeSpaceIndex, set_activeSpaceIndex] = useState(spaceGuids.indexOf(spaceGuid as string))

  const locked = activeSpace?.locked

  useEffect(() => {
    set_activeSpaceIndex(spaceGuids.indexOf(spaceGuid as string))
  }, [spaceGuid])

  const SpaceName = () => (<S.SpaceName>
    <Box>
      <Item pageTitle={activeSpace?.name}>
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

    </Item>
    </Box>

    </S.SpaceName>
  )

  const { groupsCount, channelsCount, threadsCount, messageCount } = activeSpaceStats

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
        {
          activeSpace?.previewSrc &&
            <>
             
              <Box p={.75} mb={-.5} width='100%'>
                <S.OverlayContainer>
                  <S.Overlay>
                    <SpaceName />
                  </S.Overlay>
                  <S.OverlayBottom>
                    <S.SpaceStats>
                      <Spacer />
                      <S.Badge title={`${groupsCount} groups · ${channelsCount} channels · ${threadsCount} threads· ${messageCount} messages`}>
                        {`${groupsCount}·${channelsCount}·${threadsCount}·${messageCount}`}
                      </S.Badge>
                    </S.SpaceStats>
                  
                  </S.OverlayBottom>
                  <AspectRatio
                    ratio={2}
                    backgroundSrc={activeSpace.previewSrc}
                    coverBackground
                    borderRadius={.75}
                  />
                </S.OverlayContainer>
               
              </Box>
            
            </>
        }
        {
          activeSpace?.name
            ? <>
                {
                  !activeSpace?.previewSrc && <SpaceName />
                }
              </>
            : <Box py={.75}>
                <Gap gap={.75}>
              
                <Item
                  title='Create a Space'
                  subtitle='Spaces organize your work into groups of channels.'
                />
                <Item
                  text="Let's Work Together"
                  subtitle='Hi, my name is Lexi. I can help you with any project. Think of me as your virtual coworker.'
                />
                </Gap>
              </Box>
        }

        <Groups locked={locked!} />
      </Box>
    </S.SidebarContainer>
  </S.GroupsSidebar>)
}

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
  `,
  OverlayContainer: styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    top: 0;
    z-index: 2;
  `,
  Overlay: styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 3;
    background: linear-gradient(to top, hsla(0, 0%, 7%, 0) 0%, hsla(0, 0%, 7%,.4) 40%, hsla(0, 0%, 7%,.5) 100%);
  `,
   OverlayBottom: styled.div`
    position: absolute;
    bottom: 0;
    z-index: 1;
    width: 100%;
    background: linear-gradient(to bottom, hsla(0, 0%, 7%, 0) 0%, hsla(0, 0%, 7%,.4) 40%, hsla(0, 0%, 7%,.5) 100%);
  `,
  SpaceName: styled.div`
    width: 100%;
  `,
  SpaceStats: styled.div`
    width: calc(100% - 1rem);
    height: 2rem;
    padding: .5rem;
    display: flex;
  `,
  PosterContainer: styled.div`
    border-radius: .75rem;
    overflow: hidden;
    width: 100%;
  `,
  Badge: styled.div`
    background: var(--F_Surface_0);
    padding: .5rem 1rem;
    border-radius: 1rem;
    font-family: monospace;
    color: var(--F_Font_Color_Disabled);
  `
}