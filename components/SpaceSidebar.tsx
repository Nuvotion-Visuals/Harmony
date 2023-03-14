import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Groups } from 'components/Groups'
import { AspectRatio, Box, SpacesSidebar, Item, Dropdown, Gap, Button, LineBreak } from '@avsync.live/formation'
import { useSpaces } from 'redux-tk/spaces/hook'
import { useRouter } from 'next/router'

interface Props {

}

export const SpaceSidebar = ({ }: Props) => {
  const router = useRouter()

  const { spaceGuid } = router.query

  const { spacesInfo, spaceGuids, activeSpace, removeSpace, activeSpaceGuid, updateSpace } = useSpaces()

  const [activeSpaceIndex, set_activeSpaceIndex] = useState(spaceGuids.indexOf(spaceGuid as string))

  const locked = activeSpace?.locked

  useEffect(() => {
    set_activeSpaceIndex(spaceGuids.indexOf(spaceGuid as string))
  }, [spaceGuid])

  const SpaceName = () => (<S.SpaceName>
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
    </S.SpaceName>
  )

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
    <Box wrap width='100%'>
      
      {
        activeSpace?.previewSrc &&
        <>
          <S.OverlayContainer>
            <S.Overlay>
              <SpaceName />
             
            </S.Overlay>
          </S.OverlayContainer>
         <AspectRatio
            ratio={2}
            backgroundSrc={activeSpace.previewSrc}
            coverBackground
          >
            
          </AspectRatio>
      
        </>
         
      }
        {
          activeSpace?.name
            ? <>
                {
                  !activeSpace?.previewSrc && <SpaceName />
                }
                <LineBreak />
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
  </S.GroupsSidebar>)
}

const S = {
  GroupsSidebar: styled.div`
    display: flex;
    height: calc(100% - var(--F_Header_Height));
    align-items: flex-start;
  `,
  OverlayContainer: styled.div`
    height: 0;
    width: 100%;
    position: relative;
    top: 0;
    z-index: 2;
  `,
  Overlay: styled.div`
    width: 100%;
    height: 3rem;
    background: linear-gradient(to top, hsla(0, 0%, 7%, 0) 0%, hsla(0, 0%, 7%,.4) 40%, hsla(0, 0%, 7%,.5) 100%);
 
  `,
  SpaceName: styled.div`
    width: 100%;
  `
}