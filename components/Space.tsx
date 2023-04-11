import { AspectRatio, Box, Button, Dropdown, Gap, Item, LineBreak, markdownToHTML, Page, RichTextEditor, Spacer, useBreakpoint } from '@avsync.live/formation'
import React, { useEffect, useState } from 'react'
import { Space as SpaceProps } from 'redux-tk/spaces/types'
import { useSpaces_activeSpace, useSpaces_activeSpaceGuid, useSpaces_channelsByGuid, useSpaces_groupsByGuid, useSpaces_threadsByGuid, useSpaces_updateSpace } from 'redux-tk/spaces/hook'
import styled from 'styled-components'
import { Badge } from './Badge'
import { useLayout_decrementActiveSwipeIndex } from 'redux-tk/layout/hook'
import { ZoomableHierarchyNavigator } from './ZoomableHierarchyNavigator'

interface Props {
  
}

export const Space = ({ }: Props) => {
  const activeSpace = useSpaces_activeSpace()
  // const activeSpaceStats = useSpaces_activeSpaceStats()
  const updateSpace = useSpaces_updateSpace()
  const activeSpaceGuid = useSpaces_activeSpaceGuid()
  const groupsByGuid = useSpaces_groupsByGuid()
  const channelsByGuid = useSpaces_channelsByGuid()
  const threadsByGuid = useSpaces_threadsByGuid()

  const [localValue, set_localValue] = useState(activeSpace?.description || '')
  const [edit, set_edit] = useState(false)

  const { isMobile } = useBreakpoint()
  const decrementActiveSwipeIndex = useLayout_decrementActiveSwipeIndex()

  useEffect(() => {
    set_localValue(activeSpace?.description || '')
  }, [activeSpace])
  
  return (<S.Space>
    <Page>
      {
        activeSpace?.previewSrc &&
        <Box pt={.75} mb={.25}>
            <S.OverlayContainer>
              <S.OverlayBottom>
              <S.SpaceStats>
                <Spacer />
                
              </S.SpaceStats>
              
              </S.OverlayBottom>
              <AspectRatio
              ratio={3}
              backgroundSrc={activeSpace?.previewSrc}
              coverBackground
              borderRadius={.75}
              />
          </S.OverlayContainer>
        </Box>
      }
    <Item 
      pageTitle={activeSpace?.name} 
      src={activeSpace?.previewSrc}
    >

    <Dropdown
      icon='ellipsis-h'
      iconPrefix='fas'
      minimal
      items={[
        {
          icon: 'pencil',
          name: 'Description',
          onClick: () => {
           set_edit(true)
          }
        },
        {
          icon: 'edit',
          name: 'Edit',
          href: `/spaces/${activeSpace?.guid}/edit`,
          onClick: () => {
            if (isMobile) {
              decrementActiveSwipeIndex()
            }
          }
        }
      ]}
    />
   
    </Item>
    <LineBreak />
    <Item>
      
    </Item>
    <RichTextEditor
      value={localValue}
      onChange={val => set_localValue(val)}
      readOnly={!edit}
    >
       {
          edit &&
            <>
              <Button
                icon='save'
                iconPrefix='fas'
                onClick={() => {
                  const newSpace = {
                    ...activeSpace,
                    description: localValue
                  } as SpaceProps
                  if (activeSpaceGuid)
                  updateSpace({ guid: activeSpaceGuid, space: newSpace})
                  set_edit(false)
                }}
                minimal
              />
              <Button
                icon='times'
                iconPrefix='fas'
                onClick={() => {
                  set_localValue(activeSpace?.description || '')
                  set_edit(false)
                }}
                minimal
              />
              <Box height='100%' />
            </>
        }
    </RichTextEditor>
    </Page>

    
  </S.Space>)
}

const S = {
  Space: styled.div`
    width: 100%;
  `,
   SpaceCard: styled.div`
    width: 100%;
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
    width: calc(100% - .75rem);
    height: 2rem;
    padding: .25rem;
    display: flex;
  `,
  PosterContainer: styled.div`
    border-radius: .75rem;
    overflow: hidden;
    width: 100%;
  `
}

