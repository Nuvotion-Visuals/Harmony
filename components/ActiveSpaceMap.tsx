import { AspectRatio, Box, Button, Dropdown, Gap, Item, LineBreak, markdownToHTML, Page, RichTextEditor, Spacer, useBreakpoint } from '@avsync.live/formation'
import React, { useEffect, useState } from 'react'
import { useSpaces_activeSpace, useSpaces_activeSpaceGuid, useSpaces_channelsByGuid, useSpaces_groupsByGuid, useSpaces_threadsByGuid, useSpaces_updateSpace } from 'redux-tk/spaces/hook'
import styled from 'styled-components'
import { ZoomableHierarchyNavigator } from './ZoomableHierarchyNavigator'

interface Props {
  
}

export const ActiveSpaceMap = ({ }: Props) => {
  const activeSpace = useSpaces_activeSpace()
  const groupsByGuid = useSpaces_groupsByGuid()
  const channelsByGuid = useSpaces_channelsByGuid()
  const threadsByGuid = useSpaces_threadsByGuid()

  const [localValue, set_localValue] = useState(activeSpace?.description || '')

  useEffect(() => {
    set_localValue(activeSpace?.description || '')
  }, [activeSpace])
  
  return (<Page>
      <Box py={1}>
        <ZoomableHierarchyNavigator
          flareData={{
            name: activeSpace?.name || '',
            children: activeSpace?.groupGuids?.map(groupGuid => ({
              name: groupsByGuid[groupGuid].name,
              size: groupsByGuid[groupGuid].channelGuids.length || 1,
              children: groupsByGuid[groupGuid].channelGuids.map(channelGuid => ({
                name: channelsByGuid[channelGuid].name,
                size: channelsByGuid[channelGuid].threadGuids.length || 1,
                children: channelsByGuid[channelGuid].threadGuids.map(threadGuid => ({
                  name: threadsByGuid[threadGuid].name,
                  size: threadsByGuid[threadGuid].messageGuids.length || 1,
                  // children: channelsByGuid[groupGuid].channelGuids
                }))
              }))
            }))
          }}
        />
      </Box>
    </Page>
  )
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

